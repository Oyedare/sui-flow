import { SuiTransactionBlockResponse } from "@mysten/sui.js/client";
import { getDecimals, formatBalance } from "./format";

export interface TaxEvent {
  date: string;
  type: 'BUY' | 'SELL';
  asset: string;
  amount: number;
  price: number;
  totalValue: number;
  costBasis?: number;
  gainLoss?: number;
}

export interface TaxReport {
  totalRealizedGain: number;
  totalRealizedLoss: number;
  events: TaxEvent[];
}

interface InventoryItem {
  amount: number;
  costBasisPerUnit: number;
}

// Map: CoinType -> List of Inventory Items (FIFO)
type Inventory = Record<string, InventoryItem[]>;

export class TaxEngine {
  /*
   * Calculates FIFO Capital Gains/Losses.
   * NOTE: For MVP, we likely lack historical price data for every past transaction 
   * unless we query an archive node or historical price API.
   * To demonstrate the ENGINE logic, we will accept a 'currentPrices' map 
   * and use it as a proxy for both cost basis and sell price if historical is missing.
   * In a real app, 'priceAtTransaction' would be fetched for each timestamp.
   */
  /*
   * Calculates FIFO Capital Gains/Losses using Historical Prices.
   * Now ASYNC to support fetching prices from Pyth Benchmarks.
   */
  static async calculateFIFO(
    transactions: SuiTransactionBlockResponse[], 
    priceProvider: (coinType: string, timestampMs: number) => Promise<number>,
    onProgress?: (processed: number, total: number) => void
  ): Promise<TaxReport> {
    // 1. Sort transactions ascending (Oldest first)
    const sortedTx = [...transactions].sort((a, b) => {
      return Number(a.timestampMs) - Number(b.timestampMs);
    });

    const inventory: Inventory = {};
    const events: TaxEvent[] = [];
    let totalRealizedGain = 0;
    let totalRealizedLoss = 0;

    let processedCount = 0;
    const totalCount = sortedTx.length;

    for (const tx of sortedTx) {
      // Update progress
      processedCount++;
      if (onProgress) onProgress(processedCount, totalCount);

      if (!tx.balanceChanges) continue;
      const date = new Date(Number(tx.timestampMs)).toLocaleDateString();
      const timestamp = Number(tx.timestampMs);

      for (const change of tx.balanceChanges) {
        const coinType = change.coinType;
        const decimals = getDecimals(coinType);
        const rawAmount = parseInt(change.amount);
        const amount = Math.abs(formatBalance(rawAmount, decimals));
        
        // Skip tiny dust
        if (amount < 0.000001) continue;

        // FETCH PRICE
        // We fetch price for this specific transaction time
        const price = await priceProvider(coinType, timestamp);
        
        // Small delay to be nice to public API
        await new Promise(r => setTimeout(r, 50)); 

        if (rawAmount > 0) {
          // BUY / RECEIVE
          if (!inventory[coinType]) inventory[coinType] = [];
          
          inventory[coinType].push({
            amount: amount,
            costBasisPerUnit: price
          });

          events.push({
            date,
            type: 'BUY',
            asset: coinType.split('::').pop() || 'UNK',
            amount,
            price,
            totalValue: amount * price
          });

        } else if (rawAmount < 0) {
          // SELL / SEND
          let remainingToSell = amount;
          let realizedPnL = 0;
          let costBasisTotal = 0;

          if (!inventory[coinType]) inventory[coinType] = [];
          const queue = inventory[coinType];

          while (remainingToSell > 0 && queue.length > 0) {
            const oldest = queue[0];
            
            if (oldest.amount <= remainingToSell) {
              const soldAmount = oldest.amount;
              const cost = soldAmount * oldest.costBasisPerUnit;
              const proceed = soldAmount * price;
              
              realizedPnL += (proceed - cost);
              costBasisTotal += cost;
              remainingToSell -= soldAmount;
              queue.shift(); 
            } else {
              const soldAmount = remainingToSell;
              const cost = soldAmount * oldest.costBasisPerUnit;
              const proceed = soldAmount * price;
              
              realizedPnL += (proceed - cost);
              costBasisTotal += cost;
              oldest.amount -= remainingToSell;
              remainingToSell = 0;
            }
          }

          // Missing history assumption
          if (remainingToSell > 0) {
             const cost = 0; // Assume 0 cost basis
             const proceed = remainingToSell * price;
             realizedPnL += (proceed - cost);
             costBasisTotal += cost; 
          }

          if (realizedPnL > 0) totalRealizedGain += realizedPnL;
          else totalRealizedLoss += Math.abs(realizedPnL);

          events.push({
            date,
            type: 'SELL',
            asset: coinType.split('::').pop() || 'UNK',
            amount: amount,
            price,
            totalValue: amount * price,
            costBasis: costBasisTotal,
            gainLoss: realizedPnL
          });
        }
      }
    }

    return {
      totalRealizedGain,
      totalRealizedLoss,
      events
    };
  }

  static async calculateLIFO(
    transactions: SuiTransactionBlockResponse[], 
    priceProvider: (coinType: string, timestampMs: number) => Promise<number>,
    onProgress?: (processed: number, total: number) => void
  ): Promise<TaxReport> {
    // 1. Sort transactions ascending (Oldest first) for processing, but inventory management differs
    const sortedTx = [...transactions].sort((a, b) => {
      return Number(a.timestampMs) - Number(b.timestampMs);
    });

    const inventory: Inventory = {};
    const events: TaxEvent[] = [];
    let totalRealizedGain = 0;
    let totalRealizedLoss = 0;

    let processedCount = 0;
    const totalCount = sortedTx.length;

    for (const tx of sortedTx) {
      processedCount++;
      if (onProgress) onProgress(processedCount, totalCount);

      if (!tx.balanceChanges) continue;
      const date = new Date(Number(tx.timestampMs)).toLocaleDateString();
      const timestamp = Number(tx.timestampMs);

      for (const change of tx.balanceChanges) {
        const coinType = change.coinType;
        const decimals = getDecimals(coinType);
        const rawAmount = parseInt(change.amount);
        const amount = Math.abs(formatBalance(rawAmount, decimals));
        
        if (amount < 0.000001) continue;

        const price = await priceProvider(coinType, timestamp);
        await new Promise(r => setTimeout(r, 20)); // Faster delay

        if (rawAmount > 0) {
          // BUY
          if (!inventory[coinType]) inventory[coinType] = [];
          inventory[coinType].push({
            amount: amount,
            costBasisPerUnit: price
          });

          events.push({
            date,
            type: 'BUY',
            asset: coinType.split('::').pop() || 'UNK',
            amount,
            price,
            totalValue: amount * price
          });

        } else if (rawAmount < 0) {
          // SELL (LIFO: Take from end of array)
          let remainingToSell = amount;
          let realizedPnL = 0;
          let costBasisTotal = 0;

          if (!inventory[coinType]) inventory[coinType] = [];
          const stack = inventory[coinType]; // Stack for LIFO

          while (remainingToSell > 0 && stack.length > 0) {
            const newest = stack[stack.length - 1]; // Look at last item
            
            if (newest.amount <= remainingToSell) {
              const soldAmount = newest.amount;
              const cost = soldAmount * newest.costBasisPerUnit;
              const proceed = soldAmount * price;
              
              realizedPnL += (proceed - cost);
              costBasisTotal += cost;
              remainingToSell -= soldAmount;
              stack.pop(); // Remove fully used batch
            } else {
              const soldAmount = remainingToSell;
              const cost = soldAmount * newest.costBasisPerUnit;
              const proceed = soldAmount * price;
              
              realizedPnL += (proceed - cost);
              costBasisTotal += cost;
              newest.amount -= remainingToSell;
              remainingToSell = 0;
            }
          }

          if (remainingToSell > 0) {
             const cost = 0;
             const proceed = remainingToSell * price;
             realizedPnL += (proceed - cost);
             costBasisTotal += cost; 
          }

          if (realizedPnL > 0) totalRealizedGain += realizedPnL;
          else totalRealizedLoss += Math.abs(realizedPnL);

          events.push({
            date,
            type: 'SELL',
            asset: coinType.split('::').pop() || 'UNK',
            amount: amount,
            price,
            totalValue: amount * price,
            costBasis: costBasisTotal,
            gainLoss: realizedPnL
          });
        }
      }
    }

    return {
      totalRealizedGain,
      totalRealizedLoss,
      events
    };
  }

  static async calculateAverage(
    transactions: SuiTransactionBlockResponse[], 
    priceProvider: (coinType: string, timestampMs: number) => Promise<number>,
    onProgress?: (processed: number, total: number) => void
  ): Promise<TaxReport> {
    const sortedTx = [...transactions].sort((a, b) => Number(a.timestampMs) - Number(b.timestampMs));
    
    // Map: CoinType -> { totalAmount, totalCost }
    const inventory: Record<string, { totalAmount: number, totalCost: number }> = {};
    const events: TaxEvent[] = [];
    let totalRealizedGain = 0;
    let totalRealizedLoss = 0;

    let processedCount = 0;
    const totalCount = sortedTx.length;

    for (const tx of sortedTx) {
      processedCount++;
      if (onProgress) onProgress(processedCount, totalCount);

      if (!tx.balanceChanges) continue;
      const date = new Date(Number(tx.timestampMs)).toLocaleDateString();
      const timestamp = Number(tx.timestampMs);

      for (const change of tx.balanceChanges) {
        const coinType = change.coinType;
        const decimals = getDecimals(coinType);
        const rawAmount = parseInt(change.amount);
        const amount = Math.abs(formatBalance(rawAmount, decimals));
        
        if (amount < 0.000001) continue;

        const price = await priceProvider(coinType, timestamp);
        await new Promise(r => setTimeout(r, 20));

        if (!inventory[coinType]) inventory[coinType] = { totalAmount: 0, totalCost: 0 };
        const pool = inventory[coinType];

        if (rawAmount > 0) {
          // BUY - Add to pool
          pool.totalAmount += amount;
          pool.totalCost += (amount * price);

          events.push({
            date,
            type: 'BUY',
            asset: coinType.split('::').pop() || 'UNK',
            amount,
            price,
            totalValue: amount * price
          });

        } else if (rawAmount < 0) {
          // SELL - Use Average Cost
          const avgCostPerUnit = pool.totalAmount > 0 ? pool.totalCost / pool.totalAmount : 0;
          
          let cost = amount * avgCostPerUnit;
          // Reduce pool
          if (pool.totalAmount >= amount) {
             pool.totalCost -= cost;
             pool.totalAmount -= amount;
          } else {
             // Selling more than tracked (missing data), assume remaining has 0 cost or same avg?
             // Usually cap cost reduction to what's in pool
             cost = pool.totalCost + (amount - pool.totalAmount) * 0; // remaining part 0 cost
             pool.totalCost = 0;
             pool.totalAmount = 0;
          }

          const proceed = amount * price;
          const realizedPnL = proceed - cost;

          if (realizedPnL > 0) totalRealizedGain += realizedPnL;
          else totalRealizedLoss += Math.abs(realizedPnL);

          events.push({
            date,
            type: 'SELL',
            asset: coinType.split('::').pop() || 'UNK',
            amount: amount,
            price,
            totalValue: amount * price,
            costBasis: cost,
            gainLoss: realizedPnL
          });
        }
      }
    }

    return {
      totalRealizedGain,
      totalRealizedLoss,
      events
    };
  }

  /*
   * Calculates Progressive Tax Liability based on Nigeria Tax Act 2025
   * Bands:
   * 0 - 800k: 0%
   * 800k - 3m: 15%
   * 3m - 12m: 18%
   * 12m - 25m: 21%
   * 25m - 50m: 23%
   * > 50m: 25%
   */
  static calculateNigeriaLiability(netGainUSD: number, exchangeRate: number) {
    if (netGainUSD <= 0) return { taxNGN: 0, taxUSD: 0, effectiveRate: 0 };

    const incomeNGN = netGainUSD * exchangeRate;
    let taxNGN = 0;

    // Band 1: First 800k (Exempt)
    const band1 = 800_000;
    
    // Band 2: 800k - 3m (15%) -> Taxable width 2.2m
    const band2 = 3_000_000;
    
    // Band 3: 3m - 12m (18%) -> Taxable width 9m
    const band3 = 12_000_000;
    
    // Band 4: 12m - 25m (21%) -> Taxable width 13m
    const band4 = 25_000_000;
    
    // Band 5: 25m - 50m (23%) -> Taxable width 25m
    const band5 = 50_000_000;

    // Progressive Logic
    let remainingIncome = incomeNGN;

    // 1. First 800k is Free
    if (remainingIncome > band1) {
       remainingIncome -= band1; 
       
       // 2. Next 2.2m @ 15%
       const taxableBand2 = Math.min(remainingIncome, band2 - band1);
       taxNGN += taxableBand2 * 0.15;
       remainingIncome -= taxableBand2;

       if (remainingIncome > 0) {
           // 3. Next 9m @ 18%
           const taxableBand3 = Math.min(remainingIncome, band3 - band2);
           taxNGN += taxableBand3 * 0.18;
           remainingIncome -= taxableBand3;
           
           if (remainingIncome > 0) {
               // 4. Next 13m @ 21%
               const taxableBand4 = Math.min(remainingIncome, band4 - band3);
               taxNGN += taxableBand4 * 0.21;
               remainingIncome -= taxableBand4;

               if (remainingIncome > 0) {
                   // 5. Next 25m @ 23%
                   const taxableBand5 = Math.min(remainingIncome, band5 - band4);
                   taxNGN += taxableBand5 * 0.23;
                   remainingIncome -= taxableBand5;

                   if (remainingIncome > 0) {
                       // 6. Above 50m @ 25%
                       taxNGN += remainingIncome * 0.25;
                   }
               }
           }
       }
    }

    return {
      taxNGN,
      taxUSD: taxNGN / exchangeRate,
      effectiveRate: (taxNGN / incomeNGN) * 100
    };
  }
}
