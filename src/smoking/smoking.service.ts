import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import * as moment from 'moment';

@Injectable()
export class SmokingService implements OnModuleInit {
  private history: { timestamp: moment.Moment; cause: string }[] = [];

  onModuleInit() {
    fs.createReadStream('smoking_history.csv')
      .pipe(csv())
      .on('data', (row) => {
        if (row.smoked_now === '1') {
          this.history.push({
            timestamp: moment(row.timestamp, 'YYYY-MM-DD HH:mm:ss'),
            cause: row.cause,
          });
        }
      })
      .on('end', () => {
        console.log(`Loaded ${this.history.length} smoking events from CSV.`);
      });
  }

  predictNextCigarette(): string | null {
    if (this.history.length < 2) return null;

    const intervals: number[] = [];
    for (let i = 1; i < this.history.length; i++) {
      const diff = this.history[i].timestamp.diff(this.history[i - 1].timestamp, 'minutes');
      intervals.push(diff);
    }

    const weights = intervals.map((_, i) => Math.pow(0.9, intervals.length - i - 1));
    const totalWeight = weights.reduce((a, b) => a + b, 0);

    const weightedAvg = intervals.reduce((acc, interval, idx) => {
      return acc + (interval * weights[idx]) / totalWeight;
    }, 0);

    const lastEvent = this.history[this.history.length - 1];
    return lastEvent.timestamp.add(weightedAvg, 'minutes').format('YYYY-MM-DD HH:mm:ss');
  }



// predictNextCigarette(): string | null {
//   return '2025-04-20 05:50:00'; // Return the fixed date and time
// }

}
