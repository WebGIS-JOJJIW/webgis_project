import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-shared-table',
  templateUrl: './shared-table.component.html',
  styleUrls: ['./shared-table.component.scss']
})
export class SharedTableComponent implements OnInit {
  @Input() data: any[] = [];  // Table data (rows)
  @Input() columns: any[] = [];  // Columns configuration
  @Input() showFilters: boolean = true;  // Show/Hide filters
  @Input() selectAllLabel: string = 'ทั้งหมด';  // Checkbox labels
  @Input() selectAlarmLabel: string = 'Alarm';
  @Input() selectInfoLabel: string = 'Info';

  @Output() selectAllChange = new EventEmitter<boolean>();
  @Output() selectAlarmChange = new EventEmitter<boolean>();
  @Output() selectInfoChange = new EventEmitter<boolean>();
  @Output() searchTermChange = new EventEmitter<string>();

  searchTerm: string = '';
  filteredData: any[] = [];

  ngOnInit() {
    this.filteredData = this.data;
  }

  onSearchChange(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.searchTermChange.emit(searchTerm);
    
    this.filteredData = this.data.filter(row => {
      return Object.values(row).some(value => {
        if (value !== null && value !== undefined) {
          return String(value).toLowerCase().includes(searchTerm);
        }
        return false;
      });
    });
  }

  onSelectAll(event: any) {
    this.selectAllChange.emit(event.target.checked);
  }

  onSelectAlarm(event: any) {
    this.selectAlarmChange.emit(event.target.checked);
  }

  onSelectInfo(event: any) {
    this.selectInfoChange.emit(event.target.checked);
  }
}
