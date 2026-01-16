import ExcelJS from "exceljs";
import type { OrderEmailData, ClientEmailData } from "../email/types";

/**
 * Generate Excel file buffer for order details
 * @param order - Order data
 * @param client - Client data
 * @returns Promise<Buffer> - Excel file buffer
 */
export async function generateOrderExcel(
  order: OrderEmailData,
  client: ClientEmailData,
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Order Details");

  // Set column widths
  worksheet.getColumn(1).width = 20; // Product ID
  worksheet.getColumn(2).width = 40; // Product Name
  worksheet.getColumn(3).width = 12; // Quantity

  // Header section (above the table)
  let currentRow = 1;

  // Order ID
  worksheet.getCell(`A${currentRow}`).value = "Order ID:";
  worksheet.getCell(`A${currentRow}`).font = { bold: true };
  worksheet.getCell(`B${currentRow}`).value = order.orderNumber;
  currentRow++;

  // Client ID
  worksheet.getCell(`A${currentRow}`).value = "Client ID:";
  worksheet.getCell(`A${currentRow}`).font = { bold: true };
  worksheet.getCell(`B${currentRow}`).value = client.clientId;
  currentRow++;

  // Delivery Date
  worksheet.getCell(`A${currentRow}`).value = "Delivery Date:";
  worksheet.getCell(`A${currentRow}`).font = { bold: true };
  worksheet.getCell(`B${currentRow}`).value = order.deliveryDate;
  currentRow++;

  // Empty row for spacing
  currentRow++;

  // Table header row
  const headerRow = worksheet.getRow(currentRow);
  headerRow.values = ["Product ID", "Product Name", "Quantity"];
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF6a844a" }, // Elegardens green color
  };
  headerRow.alignment = {
    vertical: "middle",
    horizontal: "center",
  };
  headerRow.height = 25;

  // Apply borders to header row
  ["A", "B", "C"].forEach((col) => {
    const cell = worksheet.getCell(`${col}${currentRow}`);
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  currentRow++;

  // Add data rows
  order.items.forEach((item) => {
    const row = worksheet.getRow(currentRow);
    row.values = [item.itemId, item.itemName, item.quantity];

    // Apply borders to data row
    ["A", "B", "C"].forEach((col) => {
      const cell = worksheet.getCell(`${col}${currentRow}`);
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Center align quantity column
    worksheet.getCell(`C${currentRow}`).alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    // Set row height
    row.height = 20;

    currentRow++;
  });

  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
