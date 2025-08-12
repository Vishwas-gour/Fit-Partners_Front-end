import React, { useEffect } from 'react'
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function PdfGenerate({ order }) {
    const generatePDF = () => {
        const doc = new jsPDF();

        // ==== HEADER ====
        doc.setFontSize(22);
        doc.setTextColor(40, 40, 40);
        doc.text("FitWear - Invoice", 14, 20);

        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text("Thank you for shopping with us!", 14, 27);

        // ==== ORDER DETAILS ====
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`Order ID: ${order.id}`, 14, 40);
        doc.text(`Status: ${order.orderStatus}`, 14, 47);
        doc.text(`Payment Method: ${order.paymentMethod}`, 14, 54);
        doc.text(`Order Date: ${new Date(order.createdAt).toLocaleString()}`, 14, 61);

        // ==== TABLE ====
        const tableColumn = [
            { header: "Product", dataKey: "product" },
            { header: "Brand", dataKey: "brand" },
            { header: "Qty", dataKey: "quantity" },
            { header: "Sale Price", dataKey: "salePrice" },
            { header: "Discount %", dataKey: "discount" },
            { header: "Price After Discount", dataKey: "priceAfterDiscount" },
            { header: "Cart Price", dataKey: "cartPrice" },
        ];

        const tableRows = order.items.map(item => ({
            product: item.shoeName,
            brand: item.brand,
            quantity: item.quantity,
            salePrice: `Rs ${item.salePrice.toLocaleString()}`,
            discount: `${item.discountPercent}%`,
            priceAfterDiscount: `Rs ${item.salePriceWithDiscount.toLocaleString()}`,
            cartPrice: `Rs ${item.cartPrice.toLocaleString()}`
        }));

        autoTable(doc, {
            columns: tableColumn,
            body: tableRows,
            startY: 70,
            theme: "grid",
            headStyles: { fillColor: [128, 128, 128], textColor: 255, halign: "center" },
            bodyStyles: { fillColor: [240, 240, 240], textColor: 0, halign: "center" },
            styles: { fontSize: 10 },
        });

        // ==== TOTAL AMOUNT ====
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(`Total Amount: Rs${order.totalAmount.toLocaleString()}`, 14, finalY);

        // ==== FOOTER ====
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("For any queries, contact support@fitwear.com", 14, finalY + 10);
        doc.text("Thank you for your purchase!", 14, finalY + 16);

        // SAVE
        doc.save(`order_${order.id}.pdf`);
    };

    useEffect(() => {
        generatePDF();
    },[order])
    return (
        <>
        </>
    )
}

export default PdfGenerate