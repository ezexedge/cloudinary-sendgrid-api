const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)


exports.emailFeedback = (req,res)=> {
    console.log(req.body)

   // const {name , email , message, phone , uploadedFiles} = req.body   version anterior

     const {name , email , message} = req.body

    const emailData = {
        to : 'ezeedge@gmail.com' ,
        from : 'sendgridcuentagallardo@gmail.com',
        subject: 'feedback from',
        html: `

        <h1>Customer feedback form</h1>

        <hr/>

        <h2>Nombre : ${name}<h2/>
        <h2>Email: ${email}<h2/>
        <p>Mensaje: ${message}<p/>
  
        <p>https://febackonline.com</p>

        
        `

    }
/*  version anterior
    const emailData = {
        to : process.env.EMAIL_TO ,
        from : email,
        subject: 'feedback from',
        html: `

        <h1>Customer feedback form</h1>

        <hr/>

        <h2>Sender name ${name}<h2/>
        <h2>Sender email ${email}<h2/>
        <h2>Sender message ${message}<h2/>
        <br/>
            ${uploadedFiles.map(f => {
                return `<img src="${f.secure_url}" alt="${f.original_filename}" style="width:50%;overflow:hidden;padding:50px;" />`
            })}
        <br/>
        
        <p>https://febackonline.com</p>

        
        `

    }

*/

    sgMail.send(emailData)
        .then(sent => {
            console.log(sent)

            return res.json({
                succes: true
            })
        })
        .catch(err => {
            console.log(err)

            return res.json({
                succes: false
            })
        })
    

}




