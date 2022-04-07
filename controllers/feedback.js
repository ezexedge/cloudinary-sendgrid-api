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
          return res.status(200).json({
            message: `se realizo la inscripcion con exito y se le ah enviado informacion a su correo`,
          });
        })
        .catch((err) => console.log(`Problem sending email: ${err}`));   
    

}


exports.verify =  async (req,res)=> {


  try{


    const {id} = req.params

    if(id){

   

    let valor2     =   jwt.decode(id)

    console.log('..valor2',valor2)

    let resultEncontrar = await  fetch(`http://dev.texdinamo.com/curabrochero/wp-json/wp/v2/users?search=${valor2.email}`,{
      method: "GET",
      headers: {
         Accept: 'application/json',
         "Content-type": "application/json",
         Authorization: `Basic YWRtaW46YWRtaW4=`
     },
  })

  let pepa = await resultEncontrar.json()



  console.log('s.......',pepa)


    

    
     if(pepa.length === 0){

      console.log('entreeee')
      let valor     =   jwt.decode(id)

      console.log('valorrrrr333',valor)

      let obj = {
        first_name: valor.name
      }


      var formdata = new FormData();
formdata.append("email", `${valor.email}`);
formdata.append("password", `${valor.password}`);
formdata.append("first_name", `${valor.name}`);
formdata.append("last_name", "");
formdata.append("user_meta", "{\"ciudad\":\"\",\"pais\":\"\"}");

      let result2 = await fetch(`http://dev.texdinamo.com/curabrochero/?rest_route=/simple-jwt-login/v1/users`,{
        method: "POST",
        headers: {
            Accept: 'application/json',
            "Content-type": "application/json",
            Authorization: `Basic WRtaW46YWRtaW4=`
        },
        body: formdata

    })

    let pepa2 = await result2.json()
    console.log('sssp-0000--',pepa2)


    res.redirect(`https://pwa-turismo-nblu2.ondigitalocean.app?verify`)
 
     }else{
   
       res.redirect(`https://pwa-turismo-nblu2.ondigitalocean.app?expired`)

     }

   

    }


//el token
    //  console.log('ssss',id)
    //http://localhost:8888/curabrochero/?rest_route=/simple-jwt-login/v1/users&email=NEW_USER_EMAIL&password=NEW_USER_PASSWORD
    res.status(200).json({msg: 'pepaaa'})

  }catch(err){
    console.log('....error',err)
  }

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