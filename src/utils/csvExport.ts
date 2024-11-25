import Papa from 'papaparse';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { ChecklistItem } from '../types';

const CSV_PASSWORD = 'Passwort123!';

export function exportToCSV(data: ChecklistItem[]): void {
  if (!Array.isArray(data)) {
    alert('Ungültiges Datenformat');
    return;
  }

  try {
    const password = prompt('Bitte geben Sie das Passwort ein, um die Daten herunterzuladen:');
    
    if (!password) {
      return;
    }
    
    if (password !== CSV_PASSWORD) {
      alert('Ungültiges Passwort');
      return;
    }

    if (data.length === 0) {
      alert('Keine Daten zum Exportieren verfügbar');
      return;
    }

    // Sort data by date
    const sortedData = [...data].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Create sections
    const sections = [
      createFoodSection(sortedData),
      createEquipmentSection(sortedData),
      createCleaningSection(sortedData),
      createRevenueSection(sortedData),
      createMonthlyTotalsSection(sortedData)
    ].filter(Boolean);

    // Join sections with empty rows and ensure proper encoding
    const csvContent = '\ufeff' + sections.join('\n\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const monthKey = format(new Date(), 'yyyy-MM');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `melmer-stuebchen-checkliste-${monthKey}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Export error:', error);
    alert('Export fehlgeschlagen. Bitte versuchen Sie es später erneut.');
  }
}

function createFoodSection(data: ChecklistItem[]): string {
  try {
    const rows = [
      ['1. Lebensmittel-Temperaturüberwachung'],
      ['Datum', 'Uhrzeit', 'Mitarbeiter', 'Lebensmittel', 'Temperatur (°C)'],
      ...data.flatMap(item => 
        (item.foodItems || [])
          .filter(food => food?.name && food.name.trim())
          .map(food => [
            format(new Date(item.date), 'dd.MM.yyyy'),
            item.timestamps?.section1 || '',
            item.employeeName || '',
            food.name.trim(),
            (food.temperature || 0).toString()
          ])
      )
    ];
    return Papa.unparse(rows);
  } catch (error) {
    console.error('Error creating food section:', error);
    return '';
  }
}

function createEquipmentSection(data: ChecklistItem[]): string {
  try {
    const rows = [
      ['2. Geräte-Temperaturüberwachung'],
      ['Datum', 'Uhrzeit', 'Mitarbeiter', 'Gerät', 'Temperatur (°C)'],
      ...data.flatMap(item => [
        [format(new Date(item.date), 'dd.MM.yyyy'), item.timestamps?.section2 || '', item.employeeName || '', 'Warmhaltewagen', (item.hotCartTemp || 0).toString()],
        [format(new Date(item.date), 'dd.MM.yyyy'), item.timestamps?.section2 || '', item.employeeName || '', 'Kühlvitrine', (item.coldCartTemp || 0).toString()],
        [format(new Date(item.date), 'dd.MM.yyyy'), item.timestamps?.section2 || '', item.employeeName || '', 'Kühltheke', (item.displayCaseTemp || 0).toString()]
      ])
    ];
    return Papa.unparse(rows);
  } catch (error) {
    console.error('Error creating equipment section:', error);
    return '';
  }
}

function createCleaningSection(data: ChecklistItem[]): string {
  try {
    const rows = [
      ['3. Reinigungsnachweis'],
      ['Datum', 'Uhrzeit', 'Mitarbeiter', 'Aufgabe', 'Status'],
      ...data.flatMap(item => [
        [format(new Date(item.date), 'dd.MM.yyyy'), item.timestamps?.section3 || '', item.employeeName || '', 'Kaffeemaschine gereinigt', item.coffeeMachineCleaned ? 'Ja' : 'Nein'],
        [format(new Date(item.date), 'dd.MM.yyyy'), item.timestamps?.section3 || '', item.employeeName || '', 'Wasserspender gereinigt', item.waterDispenserCleaned ? 'Ja' : 'Nein'],
        [format(new Date(item.date), 'dd.MM.yyyy'), item.timestamps?.section3 || '', item.employeeName || '', 'Wasserspender-Düse desinfiziert', item.waterDispenserNozzle ? 'Ja' : 'Nein'],
        [format(new Date(item.date), 'dd.MM.yyyy'), item.timestamps?.section3 || '', item.employeeName || '', 'Spüle und Theke gereinigt', item.sinkCounterCleaned ? 'Ja' : 'Nein'],
        [format(new Date(item.date), 'dd.MM.yyyy'), item.timestamps?.section3 || '', item.employeeName || '', 'Glasregal gereinigt', item.glassShelfCleaned ? 'Ja' : 'Nein']
      ])
    ];
    return Papa.unparse(rows);
  } catch (error) {
    console.error('Error creating cleaning section:', error);
    return '';
  }
}

function createRevenueSection(data: ChecklistItem[]): string {
  try {
    const rows = [
      ['4. Tagesumsatz'],
      ['Datum', 'Uhrzeit', 'Mitarbeiter', 'Bar (€)', 'EC (€)', 'Gesamt (€)'],
      ...data.map(item => [
        format(new Date(item.date), 'dd.MM.yyyy'),
        item.timestamps?.section4 || '',
        item.employeeName || '',
        (item.dailySales?.cash || 0).toFixed(2),
        (item.dailySales?.card || 0).toFixed(2),
        (item.dailySales?.total || 0).toFixed(2)
      ])
    ];
    return Papa.unparse(rows);
  } catch (error) {
    console.error('Error creating revenue section:', error);
    return '';
  }
}

function createMonthlyTotalsSection(data: ChecklistItem[]): string {
  try {
    // Group data by month
    const monthlyData = data.reduce((acc, item) => {
      const date = new Date(item.date);
      const monthKey = format(date, 'yyyy-MM');
      
      if (!acc[monthKey]) {
        acc[monthKey] = {
          cash: 0,
          card: 0,
          total: 0,
          startDate: startOfMonth(date),
          endDate: endOfMonth(date)
        };
      }
      
      acc[monthKey].cash += item.dailySales?.cash || 0;
      acc[monthKey].card += item.dailySales?.card || 0;
      acc[monthKey].total += item.dailySales?.total || 0;
      
      return acc;
    }, {} as Record<string, { cash: number; card: number; total: number; startDate: Date; endDate: Date }>);

    const rows = [
      ['5. Monatliche Umsatzübersicht'],
      ['Monat', 'Bar (€)', 'EC (€)', 'Gesamt (€)'],
      ...Object.entries(monthlyData)
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([_, data]) => [
          format(data.startDate, 'MMMM yyyy'),
          data.cash.toFixed(2),
          data.card.toFixed(2),
          data.total.toFixed(2)
        ])
    ];

    return Papa.unparse(rows);
  } catch (error) {
    console.error('Error creating monthly totals section:', error);
    return '';
  }
}