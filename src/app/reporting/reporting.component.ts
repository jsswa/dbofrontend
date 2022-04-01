import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ProductsService } from '../services/products.service';
Chart.register(...registerables);
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.css']
})
export class ReportingComponent implements OnInit {
  chart = null;
  labels = [];
  dataCA = [];
  dataCout = [];
  dataMarge = [];
  data = {
    labels: this.labels,
    datasets: [{
      label: 'Chiffres d\'affaires',
      data: this.dataCA,
      fill: false,
      borderColor: 'rgb(0, 0, 255)',
      backgroundColor: 'rgb(0, 0, 0)',
      tension: 0.1
    },
      {
        label: 'Cout',
        data: this.dataCout,
        fill: false,
        borderColor: 'rgb(255, 0, 0)',
        backgroundColor: 'rgb(0, 0, 0)',
        tension: 0.1
      },
    {
        label: 'Marge',
      data: this.dataMarge,
        fill: false,
        borderColor: 'rgb(0, 255, 0)',
        backgroundColor: 'rgb(0, 0, 0)',
        tension: 0.1
      }]
  };

  transactions = null;
  filtrage = [{ name: 'all' }, { name: 'année' }, { name: 'trimestre' }, { name: 'mois' }, { name: 'semaine' }, { name: 'jour' }]
  chiffreAffaires = 0;
  marge = 0;
  impot = 0;
  categories = [
    { "id": 0, "name": "poissons", "products": null },
    { "id": 2, "name": "crustaces", "products": null },
    { "id": 1, "name": "coquillages", "products": null },
  ];

  constructor(public productsService: ProductsService, public datePipe: DatePipe) { }

  ngOnInit() {
    this.getTransaction();
    this.getMarge()
  }

  getTransaction() {
    this.productsService.getTransaction().subscribe(res => {
      this.transactions = res;
      this.getchiffresAffaire("année")
      this.getMarge()
    },
      (err) => {
        alert('failed loading json data');
      });
  }

  getTransactionCategory(idCategory) {
    this.productsService.getTransactionCategory(idCategory).subscribe(res => {
      this.transactions = res;
      this.getchiffresAffaire("année");
      this.getMarge()
    },
      (err) => {
        alert('failed loading json data');
      });
  }

  convertDate(filtrage, date){
    let dateConvert = ""
    if (filtrage == "année") {
      dateConvert = date.toLocaleString('default', { month: 'long' })
    }
    else if (filtrage == "mois") {
      dateConvert = date.getDate()
    }
    else if (filtrage == "semaine") {
      dateConvert = date.toLocaleString('default', { weekday: 'long' })
    }
    else if (filtrage == "jour") {
      dateConvert = date.getHours()
    } else {
      dateConvert = date.getFullYear()
    }
    return dateConvert;
  }

  getchiffresAffaire(filtrage){
    this.labels = [];
    this.dataCA = [];
    this.dataCout = [];
    this.dataMarge = [];
    this.chiffreAffaires = 0
    let today = new Date();
    let todayYear = today.getFullYear();
    let todayTrimestre = Math.ceil((today.getMonth() + 1) / 4)
    let todayMonth = today.toLocaleString('default', { month: 'long' })
    let todayMonthDay = today.getDate();
    for (let i = 0; i < this.transactions.length; i++) {
      let dateExist = false
      let date = new Date(this.transactions[i].created)
      let transacYear = date.getFullYear();
      let transacTrimestre = Math.ceil((date.getMonth() + 1) / 4)
      let transacMonth = date.toLocaleString('default', { month: 'long' })
      let transacMonthDay = date.getDate();
      let transacWeekday = date.toLocaleString('default', { weekday: 'long' })
      let transacHour = date.getHours()
      if (this.transactions[i].type == "Sale") {
        if (filtrage == "année") {
          if (transacYear == todayYear) {
            this.chiffreAffaires = this.chiffreAffaires + this.transactions[i].price
            for (let j = 0; j < this.labels.length; j++) {
              if (this.labels[j] == transacMonth) {
                this.dataCA[j] = this.dataCA[j] + this.transactions[i].price
                this.dataMarge[j] = this.dataMarge[j] + this.transactions[i].price
                dateExist = true;
              }
            }
            if (dateExist == false) {
              this.dataCout[this.dataCout.length] = 0
              this.dataCA[this.dataCA.length] = this.transactions[i].price;
              this.labels[this.labels.length] = transacMonth;
              this.dataMarge[this.dataMarge.length] = this.transactions[i].price
            }
          }
        }
        else if (filtrage == "trimestre") {
          if (transacYear == todayYear) {
            this.chiffreAffaires = this.chiffreAffaires + this.transactions[i].price
            for (let j = 0; j < this.labels.length; j++) {
              if (this.labels[j] == transacTrimestre) {
                this.dataCA[j] = this.dataCA[j] + this.transactions[i].price
                this.dataMarge[j] = this.dataMarge[j] + this.transactions[i].price
                dateExist = true;
              }
            }
            if (dateExist == false) {
              this.dataCout[this.dataCout.length] = 0
              this.dataCA[this.dataCA.length] = this.transactions[i].price;
              this.labels[this.labels.length] = transacTrimestre;
              this.dataMarge[this.dataMarge.length] = this.transactions[i].price
            }
          }
        }
        else if (filtrage == "mois") {
          if (transacYear == todayYear && transacMonth == todayMonth) {
            this.chiffreAffaires = this.chiffreAffaires + this.transactions[i].price
            for (let j = 0; j < this.labels.length; j++) {
              if (this.labels[j] == transacMonthDay) {
                this.dataCA[j] = this.dataCA[j] + this.transactions[i].price
                this.dataMarge[j] = this.dataMarge[j] + this.transactions[i].price
                dateExist = true;
              }
            }
            if (dateExist == false) {
              this.dataCout[this.dataCout.length] = 0
              this.dataCA[this.dataCA.length] = this.transactions[i].price;
              this.labels[this.labels.length] = transacMonthDay;
              this.dataMarge[this.dataMarge.length] = this.transactions[i].price
            }
          }
        }
        else if (filtrage == "semaine") {
          if (transacYear == todayYear && transacMonth == todayMonth) {
            this.chiffreAffaires = this.chiffreAffaires + this.transactions[i].price
            for (let j = 0; j < this.labels.length; j++) {
              if (this.labels[j] == transacWeekday) {
                this.dataCA[j] = this.dataCA[j] + this.transactions[i].price
                this.dataMarge[j] = this.dataMarge[j] + this.transactions[i].price
                dateExist = true;
              }
            }
            if (dateExist == false) {
              this.dataCout[this.dataCout.length] = 0
              this.dataCA[this.dataCA.length] = this.transactions[i].price;
              this.labels[this.labels.length] = transacWeekday;
              this.dataMarge[this.dataMarge.length] = this.transactions[i].price
            }
          }
        }
        else if (filtrage == "jour") {
          if (transacYear == todayYear && transacMonth == todayMonth && transacMonthDay == todayMonthDay) {
            this.chiffreAffaires = this.chiffreAffaires + this.transactions[i].price
            for (let j = 0; j < this.labels.length; j++) {
              if (this.labels[j] == transacHour) {
                this.dataCA[j] = this.dataCA[j] + this.transactions[i].price
                this.dataMarge[j] = this.dataMarge[j] + this.transactions[i].price
                dateExist = true;
              }
            }
            if (dateExist == false) {
              this.dataCout[this.dataCout.length] = 0
              this.dataCA[this.dataCA.length] = this.transactions[i].price;
              this.labels[this.labels.length] = transacHour;
              this.dataMarge[this.dataMarge.length] = this.transactions[i].price
            }
          }
        } else {
          this.chiffreAffaires = this.chiffreAffaires + this.transactions[i].price
          for (let j = 0; j < this.labels.length; j++) {
            if (this.labels[j] == transacYear) {
              this.dataCA[j] = this.dataCA[j] + this.transactions[i].price
              this.dataMarge[j] = this.dataMarge[j] + this.transactions[i].price
              dateExist = true;
            }
          }
          if (dateExist == false) {
            this.dataCout[this.dataCout.length] = 0
            this.dataCA[this.dataCA.length] = this.transactions[i].price;
            this.labels[this.labels.length] = transacYear;
            this.dataMarge[this.dataMarge.length] = this.transactions[i].price
          }
        }
      }
      else if (this.transactions[i].type == "Purchase"){
        if (filtrage == "année") {
          if (transacYear == todayYear) {
            for (let j = 0; j < this.labels.length; j++) {
              if (this.labels[j] == transacMonth) {
                this.dataCout[j] = this.dataCout[j] + this.transactions[i].price
                this.dataMarge[j] = this.dataMarge[j] - this.transactions[i].price
                dateExist = true;
              }
            }
            if (dateExist == false) {
              this.dataCA[this.dataCA.length] = 0
              this.dataCout[this.dataCout.length] = this.transactions[i].price;
              this.labels[this.labels.length] = transacMonth;
              this.dataMarge[this.dataMarge.length] = (0 - this.transactions[i].price)
            }
          }
        }
        if (filtrage == "trimestre") {
          if (transacYear == todayYear) {
            for (let j = 0; j < this.labels.length; j++) {
              if (this.labels[j] == transacTrimestre) {
                this.dataCout[j] = this.dataCout[j] + this.transactions[i].price
                this.dataMarge[j] = this.dataMarge[j] - this.transactions[i].price
                dateExist = true;
              }
            }
            if (dateExist == false) {
              this.dataCA[this.dataCA.length] = 0
              this.dataCout[this.dataCout.length] = this.transactions[i].price;
              this.labels[this.labels.length] = transacTrimestre;
              this.dataMarge[this.dataMarge.length] = (0 - this.transactions[i].price)
            }
          }
        }
        else if (filtrage == "mois") {
          if (transacYear == todayYear && transacMonth == todayMonth) {
            for (let j = 0; j < this.labels.length; j++) {
              if (this.labels[j] == transacMonthDay) {
                this.dataCout[j] = this.dataCout[j] + this.transactions[i].price
                this.dataMarge[j] = this.dataMarge[j] - this.transactions[i].price
                dateExist = true;
              }
            }
            if (dateExist == false) {
              this.dataCA[this.dataCA.length] = 0
              this.dataCout[this.dataCout.length] = this.transactions[i].price;
              this.labels[this.labels.length] = transacMonthDay;
              this.dataMarge[this.dataMarge.length] = (0 - this.transactions[i].price)
            }
          }
        }
        else if (filtrage == "semaine") {
          if (transacYear == todayYear && transacMonth == todayMonth) {
            for (let j = 0; j < this.labels.length; j++) {
              if (this.labels[j] == transacWeekday) {
                this.dataCout[j] = this.dataCout[j] + this.transactions[i].price
                this.dataMarge[j] = this.dataMarge[j] - this.transactions[i].price
                dateExist = true;
              }
            }
            if (dateExist == false) {
              this.dataCA[this.dataCA.length] = 0
              this.dataCout[this.dataCout.length] = this.transactions[i].price;
              this.labels[this.labels.length] = transacWeekday;
              this.dataMarge[this.dataMarge.length] = (0 - this.transactions[i].price)
            }
          }
        }
        else if (filtrage == "jour") {
          if (transacYear == todayYear && transacMonth == todayMonth && transacMonthDay == todayMonthDay) {
            for (let j = 0; j < this.labels.length; j++) {
              if (this.labels[j] == transacHour) {
                this.dataCout[j] = this.dataCout[j] + this.transactions[i].price
                this.dataMarge[j] = this.dataMarge[j] - this.transactions[i].price
                dateExist = true;
              }
            }
            if (dateExist == false) {
              this.dataCA[this.dataCA.length] = 0
              this.dataCout[this.dataCout.length] = this.transactions[i].price;
              this.labels[this.labels.length] = transacHour;
              this.dataMarge[this.dataMarge.length] = (0 - this.transactions[i].price)
            }
          }
        } else {
          for (let j = 0; j < this.labels.length; j++) {
            if (this.labels[j] == transacYear) {
              this.dataCout[j] = this.dataCout[j] + this.transactions[i].price
              this.dataMarge[j] = this.dataMarge[j] - this.transactions[i].price
              dateExist = true;
            }
          }
          if (dateExist == false) {
            this.dataCA[this.dataCA.length] = 0
            this.dataCout[this.dataCout.length] = this.transactions[i].price;
            this.labels[this.labels.length] = transacYear;
            this.dataMarge[this.dataMarge.length] = (0 - this.transactions[i].price)
          }
        }
      }
    }
    this.initChart();
  }

  getWeek(d) {
    var firstDay = new Date(d.getFullYear(), d.getMonth(), 1).getDay();
    return Math.ceil((d.getDate() + (firstDay - 1)) / 7);
  }

  getMarge() {
    this.marge = 0
    let today = new Date();
    let todayYear = today.getFullYear();
    for (let i = 0; i < this.transactions.length; i++) {
      let dateExist = false
      let date = new Date(this.transactions[i].created)
      let transacYear = date.getFullYear();
      if (transacYear == todayYear){
        if (this.transactions[i].type == "Sale") {
          this.marge = this.marge + this.transactions[i].price
        }
        else if (this.transactions[i].type == "Purchase") {
          this.marge = this.marge - this.transactions[i].price
        }
      }
    }
    this.getImpot();
  }

  getImpot(){
    this.impot = (this.marge * 30)/100
  }

  initChart() {
    try {
      this.chart.destroy();
    } catch (error) {

    }
    Chart.defaults.scales.linear.min = 0;
    this.chart = new Chart('myChart', {
      type: 'line',
      data: this.data,
    });
    this.chart.data.labels = this.labels
    this.chart.data.datasets.forEach((dataset) => {
      if (dataset.label == 'Cout')
        dataset.data = this.dataCout;
      else if (dataset.label == 'Marge')
        dataset.data = this.dataMarge
      else
        dataset.data = this.dataCA;
    });
    this.chart.update();
  }
}
