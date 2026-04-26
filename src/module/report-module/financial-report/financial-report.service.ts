import { Injectable, Logger } from '@nestjs/common';
import { CreateFinancialReportDto } from './dto/create-financial-report.dto.js';
import { UpdateFinancialReportDto } from './dto/update-financial-report.dto.js';
import { MedicineOrderService } from '../../medicine-module/medicine-order/medicine-order.service.js';
import { TransactionService } from '../../transaction-module/transaction.service.js';
import { DatabaseService } from '../../../common/database/database.service.js';
import PDFDocument from 'pdfkit';
import { createObjectCsvStringifier } from 'csv-writer';
import { Response } from 'express';

@Injectable()
export class FinancialReportService {
  private readonly logger = new Logger(FinancialReportService.name);
  constructor(
      private orderService: MedicineOrderService, 
      private transactionService: TransactionService, 
      private prisma: DatabaseService
  ){}
  async getFinancialData() {
    const [transactions, orders] = await Promise.all([
      this.prisma.transaction.findMany({
        include: { transactionDetails: true },
      }),
      this.prisma.medicineOrder.findMany({
        include: { orderDetails: true },
      }),
    ]);

    const totalIncome = transactions.reduce((sum, t) => sum + t.totalPrice, 0);
    const totalExpenses = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    const totalRestocked = orders.reduce((sum, o) => {
      return sum + o.orderDetails.reduce((s, d) => s + d.quantity, 0);
    }, 0);

    const avgSpending = orders.length > 0 ? totalExpenses / orders.length : 0;
    const netProfit = totalIncome - totalExpenses;

    return {
      summary: {
        totalIncome,
        totalExpenses,
        totalRestocked,
        avgSpending,
        netProfit,
        transactionCount: transactions.length,
        orderCount: orders.length,
      },
      details: {
        transactions,
        orders,
      },
    };
  }

  async generatePdf(res: Response) {
    const data = await this.getFinancialData();
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=financial-report.pdf');

    doc.pipe(res);

    // Header
    doc.fontSize(20).text('Pharma-Ease Financial Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated at: ${new Date().toLocaleString()}`);
    doc.moveDown();

    // Summary Box
    doc.rect(50, doc.y, 500, 120).stroke();
    const startY = doc.y + 10;
    doc.text(`Total Pemasukan: Rp ${data.summary.totalIncome.toLocaleString()}`, 60, startY);
    doc.text(`Total Pengeluaran (Restok): Rp ${data.summary.totalExpenses.toLocaleString()}`, 60, startY + 20);
    doc.text(`Rata-rata Anggaran Belanja: Rp ${data.summary.avgSpending.toLocaleString()}`, 60, startY + 40);
    doc.text(`Total Obat Direstok: ${data.summary.totalRestocked} unit`, 60, startY + 60);
    doc.fontSize(14).fillColor('green').text(`Laba Bersih: Rp ${data.summary.netProfit.toLocaleString()}`, 60, startY + 85);

    doc.end();
  }

  async generateCsv() {
    const data = await this.getFinancialData();
    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'category', title: 'KATEGORI' },
        { id: 'metric', title: 'METRIK' },
        { id: 'value', title: 'NILAI' },
      ],
    });

    const records = [
      { category: 'Ringkasan', metric: 'Total Pemasukan', value: data.summary.totalIncome },
      { category: 'Ringkasan', metric: 'Total Pengeluaran', value: data.summary.totalExpenses },
      { category: 'Ringkasan', metric: 'Rata-rata Belanja', value: data.summary.avgSpending },
      { category: 'Ringkasan', metric: 'Total Obat Direstok', value: data.summary.totalRestocked },
      { category: 'Ringkasan', metric: 'Laba Bersih', value: data.summary.netProfit },
    ];

    return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);
  }
}
