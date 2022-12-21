import Modal from 'react-modal'
import React, {useState, useEffect, Fragment} from 'react'
import axios from 'axios';
import Countdown from 'react-countdown'; 
import { useMediaQuery } from 'react-responsive';
import { Button, 
     Input, Label, Form, FormGroup, ModalHeader, ModalBody, ModalFooter,  
   } from 'reactstrap'

const LoginModal = (props) =>{
    Modal.setAppElement('#root')
  const customStyles = {
    content: {
      top: '40%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      maxHeight:'90%', 
      //overflowY:'scroll',
      maxWidth:'80%',
      minWidth:'30%',  
      }
    }
    const [modalIsOpenLink, setIsOpenLink] = useState(false) 
    function openModalLink() {
      setIsOpenLink(true) 
    } 
    
    function afterOpenModal() {
      // references are now sync'd and can be accessed.
    //   subtitle.style.color = '#f00'
    }

    function closeModalLink() {
       
        if (OutletCode === '') 
           {
             setIsOpenLink(true)
             } else {
              setIsOpenLink(false) 
              setModalTitle('')
        }
       
    } 
    const [modalTitle, setModalTitle] = useState(props.modalTitle)
    const [optionsTelephoneCode] = useState(props.optionsTelephoneCode)
    const [otpExpiryDuration, setOtpExpiryDuration] = useState(props.otpExpiryDuration)
    const [OutletCode, setOutletCode] = useState(props.ouletCode)
    const [OTP, setOTP] = useState('')
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
    const [selectedTelephoneCode, setSelectedTelephoneCode] = useState(null)
    const [ContactNo, setContactNo] = useState((props.contactDetails && props.contactDetails.contactNo) || '')  
    const [errorMessageOTP, setErrorMessageOTP] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [loggedIn, setLoggedIn] = useState((props.contactDetails && props.contactDetails.loggedIn) || false)
    const [tokenData, setTokenData] = useState(props.tokenData)
     const [otpReferenceId, setOtpReferenceId] = useState('')
     const [outletList, setOutletList] = useState(props.outletList)
     const [bookingToggle, setBookingToggle] = useState(false)
    useEffect(() => {
        setModalTitle(props.modalTitle)
        setOtpExpiryDuration(props.otpExpiryDuration)
        setOutletCode(props.OutletCode)
        setContactNo(props.contactDetails.contactNo)
        setTokenData(props.tokenData)
        setOutletList(props.outletList)
        if (props.initHandler) {
            otpHandler()
        }
    }, [props])
    useEffect(() => {
         if(bookingToggle) {
            props.bookingToggleHandler()
        }
    }, [bookingToggle])
    
    const renderer = ({minutes, seconds }) => {
        return <span>{minutes}:{seconds}</span>
       }
       const otpHandler = () => {
        // GET 'https://dev.lucidits.com/LUCIDAPI/V1/SendOTP?OTPFor=4&MobileNo=9738854149'
        if ((!loggedIn && ContactNo) || (ContactNo !== props.contactDetails.contactNo)) axios.get(`${process.env.REACT_APP_BASE_API_URL}LUCIDAPI/V1/SendOTP`,
        { 
         params:{
           OTPFor:4,

           MobileNo:ContactNo
         },
       headers: { Authorization: `Bearer ${tokenData.token}`},
       "Content-Type": "application/json"
       } 
      ).then((response) => { 
       //setOTPRefernceData(response.data.response)
       // console.log(response.data.response)
       setOtpReferenceId(response.data.response.otpReferenceId)
       setOtpExpiryDuration(Number(response.data.response.otpExpiryDuration * 60000))
      // setCountDown(response.data.response.otpExpiryDuration)
      // otp = response.data.response
        //if (otp) {
           //curl --location --request POST 'https://dev.lucidits.com/LUCIDAPI/V1/ValidateOTP' \
          //--header 'Content-Type: application/json' \
   //--data-raw '{
    //   "OTPReferenceId": "",
      // "OTP": "123", 
       //}
   //}'
      //  }
      })     
      }
   
      const otpValidateHandler = () => {
       // curl --location --request POST 'https://dev.lucidits.com/LUCIDAPI/V1/ValidateOTP' \
       //  --header 'Content-Type: application/json' \
       // --data-raw '{
       // "OTPReferenceId": "",
       // "OTP": "123",
       // "SystemDetails":{
       //     "ApplicationName":"",
         //	"ApplicationVersion":"1.0",
         //	"BrowserName":"",
         //	"BrowserVersion":"",
         //	"DeviceId":"",
         //	"DeviceType":"Tab",
         //	"IP":"",
         //	"Mac":"",
         //	"OPS":"",
         //	"Source":"TabletPOS",
         //	"SystemName":"Yuvaraj",
         //	"SystemTimeZoneId":1
       // }
       //}'
       axios.post(`${process.env.REACT_APP_BASE_API_URL}LUCIDAPI/V1/ValidateOTP`, 
             {
               OTPReferenceId: otpReferenceId,
                OTP
               }
            , {
            headers: { Authorization: `Bearer ${outletList.token}`}}
          ).then(res => {
           //console.log(res.data)
           if (res.data.errorCode === 0) {
              setErrorMessageOTP('') 
              setLoggedIn(true)
             // if (modalOpened) setModalOpened(!modalOpened)
             // setModalOTP(false)
              localStorage.setItem('contactDetails',JSON.stringify({contactNo:ContactNo, firstName: props.FirstName, lastName: props.LastName, loggedIn:true}))
             if (props.diffNo) setBookingToggle(true)
             document.body.style.overflow = "visible"
             
             }
           if (res.data.errorCode === 1) {
             setErrorMessageOTP('Invalid OTP') 
             
           }
          })
         
      }
    const handleEnter = (event) => {
        if (event.target.value.length > 0) {
          const form = event.target
        //  console.log(form.id)
         if (form.id === 'otp1') document.getElementById('otp2').focus()
         if (form.id === 'otp2') document.getElementById('otp3').focus()
         if (form.id === 'otp3') document.getElementById('otp4').focus() 
        //  console.log(inputOTP2Ref.current.focus)
         // inputOTP2Ref.current.focus();
       //  form.focus()
         // const index = [...form].indexOf(event.target);
         // form.elements[index + 1].focus();
         // event.preventDefault();
        }
      }
      const LoginModalContent = () => {
        return (
          <div>
          
          <FormGroup row>   
           <Input type="select" name="tcode" id="tcode"  className='p-1 ms-2' style={isTabletOrMobile ? {fontSize:'11px', width:'60px'}: {width:'60px'}}
            onChange={e => setSelectedTelephoneCode(optionsTelephoneCode.filter(item => item.label === e.target.value))}
             >
                {optionsTelephoneCode && optionsTelephoneCode.map((field) => {
               //  console.log(field)
                   return (
                      <option key={field.value}>
                       {field.label}
                      </option>
                    )
                })}
         </Input>  
          <Input type="text" name="mobile" id="mobile" placeholder="mobile no." className='py-1 ms-2'
          style={{width:'200px'}}
           onChange={e => setContactNo(e.target.value)}
          />  
        </FormGroup>
          </div>  
        )
      }
     
      const OTPModalContent = () =>{
        return (
           <Fragment>
            <FormGroup row className="d-flex justify-content-center">  
              <Label for="name" style={{width:'70px'}}> OTP </Label> 
              <Input type="text" name="otp" id="otp1" 
               placeholder=""  maxLength="1" className='p-0 mx-1'
               style={{textAlign:'center', width:'50px'}}
               
                onChange = {e => {
                 // setErrorMessageOTP('') 
                  setOTP(e.target.value)
                  handleEnter(e)
                 }}
               />  
              <Input type="text" name="otp" id="otp2" 
              placeholder=""  maxLength="1" className='p-0 m-0'
               style={{textAlign:'center', width:'50px'}}
             
               onChange = {e => {
              //  setErrorMessageOTP('') 
                setOTP(OTP + e.target.value)
                handleEnter(e)
              }}
               />  
              <Input type="text" name="otp" id="otp3" 
               placeholder=""  maxLength="1" className='p-0 mx-1'
               style={{textAlign:'center', width:'50px'}}
            
               onChange = {e => {
               // setErrorMessageOTP('') 
                setOTP(OTP + e.target.value)
                handleEnter(e)
              }}
               /> 
            
              <Input type="text" name="otp" id="otp4" 
               placeholder=""  maxLength="1" className='p-0 m-0'
               style={{textAlign:'center', width:'50px'}}
              
               onChange = {e => {
                setOTP(OTP + e.target.value)
               // setErrorMessageOTP('') 
                //console.log(OTP) 
              }
            }
               /> 
          
          </FormGroup>
          {errorMessageOTP}
          <div className="d-flex justify-content-center m-0">
             <p><small>Resend OTP after {otpExpiryDuration && <Countdown date={Date.now() + otpExpiryDuration} 
               renderer={renderer}
               intervalDelay={0}
               precision={3}
               autoStart ={true}
               />
               }</small></p>
             </div>
           
           </Fragment>
        )
      }
      const RenderModal = () => {     
        return (
           <div>
          <Modal isOpen={modalIsOpenLink}  
              onAfterOpen={afterOpenModal}
              onRequestClose={closeModalLink}
              style={customStyles}
              overlayClassName="Overlay"
             >
              <ModalHeader  
              > 
                      <div style={{
                       borderRadius:'3px',
                       height:'10px',
                       paddingBottom:'2px',
                       fontSize:'15px'
                     }}>
                     {modalTitle}
                       </div> 
              
                </ModalHeader>
              <ModalBody style={{padding:'5px', marginTop:'10px'}}>
                {modalTitle === 'Your Contact No' && <LoginModalContent />}
                 {modalTitle === 'OTP' && <OTPModalContent />} 
                 <p>{errorMessage}</p>
              </ModalBody>
              <ModalFooter  
                className="d-flex justify-content-end "> 
                {modalTitle === 'Your Contact No' && <Button
                     onClick={() => { 
                      if (ContactNo.length !== 10) {
                          setErrorMessage('Kindly Enter Valid Mobile No')
                         // setModalError(!modalError)
                      }else {
                        setErrorMessage('')
                         otpHandler()
                         setModalTitle('OTP')
                      //setModalOpened(!modalOpened) 
                    }
                      }}
                > Continue</Button>}
               
                {modalTitle === 'OTP' && <Button color='primary'
                //style={{border:'solid red'}}
                onClick={() => {
                 otpValidateHandler()
              }}
                >
                Login
              </Button> }
              </ModalFooter>
            </Modal> 
          </div>
        )
      }

    return (
          <RenderModal />
    )
}

export default LoginModal