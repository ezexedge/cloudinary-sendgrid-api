const nodeMailer = require("nodemailer");
const path = require('path')
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const axios = require('axios')
const fetch = require('node-fetch')
const FormData = require('form-data')
const pug = require('pug');
const htmlToText = require('html-to-text');
const util = require('util');
const juice = require('juice');
const hbs = require('nodemailer-express-handlebars')

const generarHTML = ( opciones = {}) => {
  const html = pug.renderFile(`${__dirname}/../views/email-enviar.pug`, opciones);
  return juice(html);
}

const generarHTML2 = ( opciones = {}) => {
  const html = pug.renderFile(`${__dirname}/../views/nuevo-email.pug`, opciones);
  return juice(html);
}


exports.nuevoEmailValidar = async(req,res)=> {

  const { id,email } = req.body;




console.log('aca llego el id y el email',id,email)

const token = jwt.sign({ id,email }, 'cocopepa' , { expiresIn: '10m' });

  let resetUrl = `https://email-brochero-api.herokuapp.com/api/validar/${token}`

  //buscar que va en opciones,archivo y ,opciones


    

  const transporter = nodeMailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      pool: true, // This is the field you need to add
      requireTLS: true,
      auth: {
        user: "juan@texdinamo.com", // MAKE SURE THIS EMAIL IS YOUR GMAIL FOR WHICH YOU GENERATED APP PASSWORD
        pass: 'evkvepvzgeoeloga', // MAKE SURE THIS PASSWORD IS YOUR GMAIL APP PASSWORD WHICH YOU GENERATED EARLIER
      },
      tls: {
        ciphers: "SSLv3",
      },
    });
  

    const handlebarOptions = {
      viewEngine: {
          partialsDir: path.resolve( __dirname + '/../views/emails'),
          defaultLayout: false,
      },
      viewPath: path.resolve( __dirname + '/../views/emails'),
  };
  
    transporter.use('compile', hbs(handlebarOptions))
   
    const emailData = {
      from: "juan@texdinamo.com", 
      to: email,
      subject: "NUEVO CORREO VALIDAR",
      text: 'prueba',
      template: 'validaremail',
      context:{
        url: resetUrl
      }
    };

   
    return transporter
      .sendMail(emailData)
      .then((info) => {
        transporter.close();
        console.log(info)
        
        return res.status(200).json({
          message: `se realizo la inscripcion con exito y se le ah enviado informacion a su correo`,
        });
        
      })
      .catch((err) => console.log(`Problem sending email: ${err}`));   
  

}


exports.emailFeedback = (req,res)=> {

    const { name, email, password } = req.body;




    const token = jwt.sign({ name, email, password }, 'cocopepa' , { expiresIn: '10m' });

    let resetUrl = `https://email-brochero-api.herokuapp.com/api/verify/${token}`

    //buscar que va en opciones,archivo y ,opciones


    const transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        pool: true, // This is the field you need to add
        requireTLS: true,
        auth: {
          user: "juan@texdinamo.com", // MAKE SURE THIS EMAIL IS YOUR GMAIL FOR WHICH YOU GENERATED APP PASSWORD
          pass: 'evkvepvzgeoeloga', // MAKE SURE THIS PASSWORD IS YOUR GMAIL APP PASSWORD WHICH YOU GENERATED EARLIER
        },
        tls: {
          ciphers: "SSLv3",
        },
      });
    

      const handlebarOptions = {
        viewEngine: {
            partialsDir: path.resolve( __dirname + '/../views/emails'),
            defaultLayout: false,
        },
        viewPath: path.resolve( __dirname + '/../views/emails'),
    };
    
      transporter.use('compile', hbs(handlebarOptions))
     
      const emailData = {
        from: "juan@texdinamo.com", 
        to: email,
        subject: "VALIDAR CUENTA",
        text: 'prueba',
        template: 'register',
        context:{
          url: resetUrl
        }
      };
     
      return transporter
        .sendMail(emailData)
        
        .then((info) => {
          transporter.close();
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

    let resultEncontrar = await  fetch(`https://dev.texdinamo.com/curabrochero/wp-json/wp/v2/users?search=${valor2.email}`,{
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


    let formdata = new FormData();
formdata.append("email", valor.email);
formdata.append("password", valor.password);
formdata.append("first_name", valor.name);
formdata.append("last_name", "");
formdata.append("user_meta", "{\"ciudad\":\"\",\"pais\":\"\",\"emailNoValidate\":\"0\"}");
      let result2 = await fetch(`https://dev.texdinamo.com/curabrochero/?rest_route=/simple-jwt-login/v1/users`,{
        method: "POST",
        headers: {
            Authorization: `Basic WRtaW46YWRtaW4=`
        },
        body: formdata

    })

    let pepa2 = await result2
    console.log('sssp-0000--',JSON.stringify(pepa2))


    res.redirect(`https://my-app-2-7q6m3.ondigitalocean.app/login?verify`)
 
     }else{
   
       res.redirect(`https://my-app-2-7q6m3.ondigitalocean.app/login?expired`)

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



exports.validar =  async (req,res)=> {


  try{




    const {id} = req.params

    if(id){

   

    let valor2     =   jwt.decode(id)

    console.log('..valor2',valor2)

    let resultEncontrar = await  fetch(`https://dev.texdinamo.com/curabrochero/wp-json/wp/v2/users?search=${valor2.email}`,{
      method: "GET",
      headers: {
         Accept: 'application/json',
         "Content-type": "application/json",
     },
  })

  let pepa = await resultEncontrar.json()



  console.log('s.......',pepa)


    

    
     if(pepa.length === 0){

      console.log('entreeee')
      let valor     =   jwt.decode(id)

      console.log('valorrrrr333',valor)



      let obj = {
        email: valor.email
      }
  
   let result2 = await fetch(`https://dev.texdinamo.com/curabrochero/wp-json/wp/v2/update-email/${valor.id}`,{
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-type" : "application/json"
        },
        body: JSON.stringify(obj)

    })

    let pepa2 = await result2.json()
    console.log('sssp-0000--',pepa2)
//https://my-app-2-7q6m3.ondigitalocean.app/register

    res.redirect(`https://my-app-2-7q6m3.ondigitalocean.app/login?verify`)
 
     }else{
   
       res.redirect(`https://my-app-2-7q6m3.ondigitalocean.app/login?expired`)

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




exports.prueba = async(req,res)=> {






// use a template file with nodemailer


  //buscar que va en opciones,archivo y ,opciones


    let textUrl = 'https://www.youtube.com/watch?v=hnaZ83UD6Z0&list=RDhnaZ83UD6Z0&index=1'

  const transporter = nodeMailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      pool: true, // This is the field you need to add
      requireTLS: true,
      auth: {
        user: "juan@texdinamo.com", // MAKE SURE THIS EMAIL IS YOUR GMAIL FOR WHICH YOU GENERATED APP PASSWORD
        pass: 'evkvepvzgeoeloga', // MAKE SURE THIS PASSWORD IS YOUR GMAIL APP PASSWORD WHICH YOU GENERATED EARLIER
      },
      tls: {
        ciphers: "SSLv3",
      },
    });
  
    const handlebarOptions = {
      viewEngine: {
          partialsDir: path.resolve( __dirname + '/../views/emails'),
          defaultLayout: false,
      },
      viewPath: path.resolve( __dirname + '/../views/emails'),
  };
  
    transporter.use('compile', hbs(handlebarOptions))
   
    const emailData = {
      from: "juan@texdinamo.com", 
      to: 'ezeedge@gmail.com',
      subject: "NUEVO CORREO VALIDAR",
      text: 'prueba',
      template: 'reset',
      context:{
        url: textUrl
      }
    };



    return transporter
      .sendMail(emailData)
      .then((info) => {
        transporter.close();
        console.log(info)
        
        return res.status(200).json({
          message: `se realizo la inscripcion con exito y se le ah enviado informacion a su correo`,
        });
        
      })
      .catch((err) => console.log(`Problem sending email: ${err}`));   
  

}




exports.resetPassword = async(req,res)=> {

  const { email } = req.body;


  

  let obj2 = {
    email: email
  }

  console.log('ooooobj2',obj2)

  let resultEncontrar = await  fetch(`https://dev.texdinamo.com/curabrocheros/wp-json/wp/v2/search`,{
    method: "POST",
    headers: {
       Accept: 'application/json',
       "Content-type": "application/json",
   },
   body: JSON.stringify(obj2)

})

let pepa = await resultEncontrar





console.log('s.......',resultEncontrar)
console.log('s.......',pepa)


  

  
   if(pepa.error){


    
    res.status(400).json({error: 'El usuario no existe'})
    return

   }





let obj = {
  email: email
}

let result2 = await fetch(`https://dev.texdinamo.com/curabrochero/wp-json/wp/v2/create-token`,{
  method: "POST",
  headers: {
    Accept: "application/json",
    "Content-type" : "application/json"
  },
  body: JSON.stringify(obj)


})

let pepa2 = await result2.json()
console.log('sssp-0000--',pepa2)


if(pepa2 && pepa2.message){


  let textUrl = `https://my-app-2-7q6m3.ondigitalocean.app/register-password?token=${pepa2.message}`


  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    pool: true, // This is the field you need to add
    requireTLS: true,
    auth: {
      user: "juan@texdinamo.com", // MAKE SURE THIS EMAIL IS YOUR GMAIL FOR WHICH YOU GENERATED APP PASSWORD
      pass: 'evkvepvzgeoeloga', // MAKE SURE THIS PASSWORD IS YOUR GMAIL APP PASSWORD WHICH YOU GENERATED EARLIER
    },
    tls: {
      ciphers: "SSLv3",
    },
  });
  
  const handlebarOptions = {
    viewEngine: {
        partialsDir: path.resolve( __dirname + '/../views/emails'),
        defaultLayout: false,
    },
    viewPath: path.resolve( __dirname + '/../views/emails'),
  };
  
  transporter.use('compile', hbs(handlebarOptions))
  
  const emailData = {
    from: "juan@texdinamo.com", 
    to: email,
    subject: "Recupero de contraseña",
    text: 'prueba',
    template: 'resetpassword',
    context:{
      url: textUrl
    }
  };
  
  
  
  return transporter
    .sendMail(emailData)
    .then((info) => {
      transporter.close();
      console.log(info)
      
      return res.status(200).json({
        message: `se realizo la inscripcion con exito y se le ah enviado informacion a su correo`,
      });
      
    })
    .catch((err) => console.log(`Problem sending email: ${err}`));   
  
  
}else{
  res.status(400).json({error: 'error al reset passwords'})
}



   

  

}