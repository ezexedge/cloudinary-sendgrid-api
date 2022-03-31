const nodeMailer = require("nodemailer");
const path = require('path')
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const axios = require('axios')
const fetch  = require('node-fetch')

exports.emailFeedback = (req,res)=> {

    const { name, email, password } = req.body;

    const token = jwt.sign({ name, email, password }, 'cocopepa' , { expiresIn: '10m' });


    const emailData = {
        from: "juan@texdinamo.com", 
        to: email,
        subject: "CURABROCHERO VALIDAR EMAIL",
        text: 'prueba',
        html: `
        <p> DATOS email :${email} yyy name :${name} YY password :${password} </p>
        <a href=${process.env.URL_HEROKU}/api/verify/${token}>link title</a>
        `
      };

      
  
    const transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: "juan@texdinamo.com", // MAKE SURE THIS EMAIL IS YOUR GMAIL FOR WHICH YOU GENERATED APP PASSWORD
          pass: 'evkvepvzgeoeloga', // MAKE SURE THIS PASSWORD IS YOUR GMAIL APP PASSWORD WHICH YOU GENERATED EARLIER
        },
        tls: {
          ciphers: "SSLv3",
        },
      });
    


     
      return transporter
        .sendMail(emailData)
        .then((info) => {
          console.log(info)
          return res.json({
            message: `se realizo la inscripcion con exito y se le ah enviado informacion a su correo`,
          });
        })
        .catch((err) => console.log(`Problem sending email: ${err}`));   
    

}


exports.verify =  async (req,res)=> {


    const {id} = req.params

    if(id){

      const config = {
        headers: { Authorization: `Basic YWRtaW46YWRtaW4=` }
    };

    let valor2     =   jwt.decode(id)

    let resultEncontrar = await  fetch(`${process.env.URL_BROCHERO_BACK}/curabrochero/wp-json/wp/v2/users?search=${valor2.email}`,{
      method: "GET",
      headers: {
         Accept: 'application/json',
         "Content-type": "application/json",
         Authorization: `Basic WRtaW46YWRtaW4=`
     },
  })

  let pepa = await resultEncontrar.json()



  console.log('s.......',pepa)


    

    
     if(pepa.length === 0){

      console.log('entreeee')
      let valor     =   jwt.decode(id)

      let result2 = await fetch(`${process.env.URL_BROCHERO_BACK}/curabrochero/?rest_route=/simple-jwt-login/v1/users&email=${valor.email}&password=${valor.password}`,{
        method: "POST",
        headers: {
            Accept: 'application/json',
            "Content-type": "application/json"
        }
    })

    let pepa2 = await result2.json()
    console.log('sssp-0000--',pepa2)


    res.redirect(`${process.env.URL_BROCHERO_FRONT}?verify`)
 
     }

     if(pepa.length > 0){
      
        res.redirect(`${process.env.URL_BROCHERO_FRONT}?expired`)
  
       
     }

    }


//el token
    //  console.log('ssss',id)
    //http://localhost:8888/curabrochero/?rest_route=/simple-jwt-login/v1/users&email=NEW_USER_EMAIL&password=NEW_USER_PASSWORD
    res.status(200).json({msg: 'pepaaa'})

}




/*
 const prueba = async() => {
     
    const config = {
      headers: { Authorization: `Basic YWRtaW46MTIzNDU2` }
  };
  let result = await axios.get('http://localhost:8888/curabrochero/wp-json/wp/v2/users?search=qqqq@gmai.com',config)
  console.log('.....',result)
  }
*/