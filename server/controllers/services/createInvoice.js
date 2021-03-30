import easyinvoice from 'easyinvoice'
import fs from 'fs'
import sequelize from '../../models/index'
import path from 'path'


const createNewInvoice = async (req,res,next) => {
    const {order_name} = req.body
    const {orders} = req.context.models
    


    const dataOrder = [
        {product:"Baju",harga:50000}
    ,{product:"Celana",harga:50000}]
    try {
        var data = {
            "documentTitle": "Summary Order", //Defaults to INVOICE
            "currency": "IDR",
            "taxNotation": "vat", //or gst
            "marginTop": 25,
            "marginRight": 25,
            "marginLeft": 25,
            "marginBottom": 25,
            "logo": "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", //or base64
            "logoExtension": "png", //only when logo is base64
            "sender": {
                "company": "Code E-Commerce",
                "address": "Address: APL Tower, RT.9/RW.5, Tj. Duren Sel.",
                "zip": "11470",
                "city": "Jakarta Barat",
                "country": "Indonesia"
                //"custom1": "custom value 1",
                //"custom2": "custom value 2",
                //"custom3": "custom value 3"
            },
            "client": {
                "User ID": "1048",
                "address": "Clientstreet 456",
                "zip": "4567 CD",
                "city": "Clientcity",
                "country": "Indonesia"
                //"custom1": "custom value 1",
                //"custom2": "custom value 2",
                //"custom3": "custom value 3"
            },
            "invoiceNumber": "2020.0001",
            "invoiceDate": new Date().toLocaleString(),
            "products": [
                {
                    "quantity": "2",
                    "description": "Baju",
                    "tax": 0,
                    "price":150000
                },
                {
                    "quantity": "4",
                    "description": "Celana",
                    "tax": 0,
                    "price": 200000
                }
            ],
            "bottomNotice": "Kindly pay your invoice within 15 days."
        };

        const result = await easyinvoice.createInvoice(data);
        await fs.writeFileSync("server/invoices/invoice.pdf", result.pdf, 'base64');
        
        res.sendStatus(200)
    } catch (error) {
        console.log(error)
    }
}
export { createNewInvoice }