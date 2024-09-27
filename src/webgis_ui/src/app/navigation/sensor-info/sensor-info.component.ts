import { Component } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-sensor-info',
  templateUrl: './sensor-info.component.html',
  styleUrl: './sensor-info.component.scss'
})
export class SensorInfoComponent {
  public barChartOptions: ChartOptions = {
    responsive: true,
  };

  public barChartLabels: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  public barChartData: ChartData<'bar'> = {
    labels: this.barChartLabels,
    datasets: [
      { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
      { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
    ]
  };

  public barChartType: ChartType = 'bar';
}
