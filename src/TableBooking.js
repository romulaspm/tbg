import { useSearchParams, Link, useNavigate, useLocation  } from "react-router-dom";
import dateFormat from "dateformat";
import Modal from 'react-modal'
import { Button, Card, CardHeader, CardBody, CardFooter, Container,
   Row, Col, Input, Label, Form, FormGroup, Collapse,
    Table,
    Spinner
  } from 'reactstrap'
import {Image, Edit, Check, RefreshCcw, PlusCircle, MinusCircle} from 'react-feather';
import React, { useEffect, useState, useRef, Fragment } from 'react';
import axios from "axios";
import moment from "moment";
import Countdown from 'react-countdown'; 
import ReactPaginate from "react-paginate";
import { useMediaQuery } from 'react-responsive'; 
import Loading from "./Loading";
import { parse } from "@fortawesome/fontawesome-svg-core";
//import View from "./View";
//import { imagesArr } from "./images/images";

const TableBooking = () => {
  const navigate = useNavigate();
  const location = useLocation()
  const [loc] = useState(location.state ? location.state : '')
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
      borderRadius:'10px'
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
                setIsOpenLink(false) 
                setModalTitle('')  
        if (modalTitle === 'Your Booking Success')  setSaveToggle(true)  
    } 
 
  const [modalTitle, setModalTitle] = useState('')
  const [modalContent, setModalContent] = useState('')
  const contactDetails = (localStorage.getItem('contactDetails') && JSON.parse(localStorage.getItem('contactDetails'))) || '' 
  const [tableSession] = useState(sessionStorage.getItem('paramData') ? JSON.parse(sessionStorage.getItem('paramData')) : '') 
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  const [searchParams] = useSearchParams();
 // const [params] = useState(searchParams)
  
  const [OrganizationId, setOrganizationId] = useState(searchParams.get("orgid"))
  const [maxPax, setMaxPax] = useState(10)
  //const [OrganizationName] = useState(searchParams.get("orgname"))
  const [PropertyId, setPropertyId] = useState(searchParams.get("propid") !== 'NONE' ? searchParams.get("propid") : null)
  const [propertyName, setPropertyName] = useState('') //searchParams.get("propname") wrong prop name from jay's api
  const [OutletCode, setOutletCode] = useState(searchParams.get("outtcode") !== 'NONE' ? searchParams.get("outtcode") : null)
  const [outletName, setOutletName] =  useState('')
   const [remarks, setRemarks] = useState(searchParams.get("remarks"))
   const [tokenData, setTokenData] = useState('') 
  // const [areaName, setAreaName] = useState('')
 //  const [cityName, setCityName] = useState('')
    const [modalOutlet, setModalOutlet] = useState(false) 
    const [modalError, setModalError] = useState(false)
    const inputOTP1Ref = useRef(null);
    const inputOTP2Ref = useRef(null);
    const inputOTP3Ref = useRef(null);
    const inputOTP4Ref = useRef(null);
    const [propertyList, setPropertyList] = useState('')
    const [outletList, setOutletList] = useState('')
    const [outletData, setOutletData] = useState('') 
    const [timeSlotList, setTimeSlotList] = useState()
    const d = new Date()
    const [bookingDate, setBookingDate] = useState(d.toISOString().split('T')[0])
    const [BookingTime, setBookingTime] = useState('')
    const [NoOfGuest, setNoOfGuest] = useState(1)
    const [MobileCountryCodeData, setMobileCountryCodeData] = useState('')
    const [titleListData, setTitleListData] = useState('')
    const [optionsTitle, setOptionsTitle] = useState('')
    const [selectedTitle, setSelectedTitle] = useState(null)
    const [optionsTelephoneCode, setOptionsTelephoneCode] = useState('')
    const [selectedTelephoneCode, setSelectedTelephoneCode] = useState(null)
    const [GuestTitleId, setGuestTitleId] = useState(1)
    const [GuestTitle, setGuestTitle] = useState('Mr.')
    const [FirstName, setFirstName] = useState((contactDetails && contactDetails.firstName) || '') //(contactDetails && contactDetails.firstName)
    const [LastName, setLastName] = useState((contactDetails && contactDetails.lastName) || '') //(contactDetails && contactDetails.contactDetails.lastName) ||
    const [ContactNoCountryCode, setContactNoCountryCode] = useState('')       
    const [ContactNo, setContactNo] = useState((contactDetails && contactDetails.contactNo) || '')          // (contactDetails && contactDetails.contactDetails.contactNo) ||                                                             
    const [EmailId, setEmailId]  = useState('')                    
    const [Instruction, setInstruction] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    //const [modalErrorMessage, setModalErrorMessage] = useState('')
    const [otpExpiryDuration, setOtpExpiryDuration] = useState(0)
    const [otpReferenceId, setOtpReferenceId] = useState('')
    //const [OTPRefernceData, setOTPRefernceData] = useState('')
    const [countDown, setCountDown] = useState(0)
    const [OTP, setOTP] = useState('')
    const [isOpenBL, setIsOpenBL] = useState(false)
    const [totalBooking, setTotalBooking] = useState('')
    const [GuestTableBookingList, setGuestTableBookingList] = useState('')
    const [currentPage, setCurrentPage] = useState(1) 
    const [loggedIn, setLoggedIn] = useState((contactDetails && contactDetails.loggedIn) || false)
    const [bookingHandlerToggle, setBookingHandlerToggle] = useState(false)
    const handlePagination = page => setCurrentPage(page.selected + 1)
    const [imageUrl, setImageUrl] = useState()
    const [outletCount, setOutletCount] = useState(0)
    const [propertyCount, setPropertyCount] = useState(0)
    const [errorMessageOTP, setErrorMessageOTP] = useState('')
    const [spinnerToggle, setSpinnerToggle] = useState(false)
    const [timeColor, setTimeColor] = useState('')
    const [diffNo, setDiffNo] = useState(false)
    const [saveToggle, setSaveToggle] = useState(false)
    const [OTP1, setOTP1] = useState('')
    const [OTP2, setOTP2] = useState('')
    const [OTP3, setOTP3] = useState('')
    const [OTP4, setOTP4] = useState('')
    const [reservationId, setReservationId] = useState('')
    const [bookingType, setBookingType] = useState('')
    const tokenRef = useRef(true)
    const reDirect = useRef(false)
    const contactNoRef = useRef(null)
    const modalErrorRef = useRef(null)
    //setReservationId
    const clearOTPInput = () => {
      setOTP1('')
      setOTP2('')
      setOTP3('')
      setOTP4('')
     }
   
    const PropertyModal = () =>{
      return ( 
       <FormGroup row className="d-flex justify-content-around">
           {
            propertyList && propertyList.propertyList.map((prop, id) => {
               return (
                 <Col className='p-0 mx-2' key = {id}>
                 <Button outline  size="sm"  
                 style={{width:'160px', height:'50px', margin:'5px', backgroundColor:'black'}}
                 onClick={() => {
                    setPropertyName(prop.propertyName)
                    setPropertyId(prop.propertyId)
                    closeModalLink()
                   // setModalProperty(!modalProperty)
                   //setModalTitle('Select a Restaurant')
                    setOutletCode('')
                    setOutletName('')
                    }
                   }
                  >{prop.propertyName}</Button> 
               </Col>
               )
             })
           }      
     </FormGroup>   
     )
   }
    
    const SelectRestaurant = () => {
      return (
        <Fragment>
          <FormGroup row className="d-flex justify-content-around">
          {
           outletList && outletList.outletList.map((outlet, id) => {
             // console.log(outlet)
              return (
                <Col className='p-0 mx-2' key = {id}>
                <Button outline  size="sm" style={{width:'160px', height:'50px', margin:'5px',  backgroundColor:'black'}}
                 onClick={() => {
                   // console.log(outlet)
                   setOutletName(outlet.outletName)
                   setOutletCode(outlet.outletCode)
                   setImageUrl(outlet.imageUrl)  
                   closeModalLink()
                   setModalTitle('') 
                   sessionStorage.setItem('paramData',JSON.stringify({organizationId:OrganizationId, propertyId:PropertyId, propertyName:propertyName, outletCode:outlet.outletCode, outletName:outlet.outletName, imageUrl:outlet.imageUrl}))
                  }
                  }
                 >{outlet.outletName}</Button> 
              </Col>
              )
            })
          }        
    </FormGroup>
    <div className="d-flex justify-content-center m-0"> 
       </div>
        </Fragment>
      )
    }
    const LoginModalContent = () => {
      return (
        <div> 
        <FormGroup row>   
         <Input type="select" name="tcode" id="tcode"  className='p-1 ms-2' style={isTabletOrMobile ? {fontSize:'11px', width:'60px'}: {width:'60px'}}
          onChange={e => {
            modalErrorRef.current = ''
            setSelectedTelephoneCode(optionsTelephoneCode.filter(item => item.label === e.target.value))
          }}
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
      <Input type="number" name="mobileno" id="mobileno" placeholder="Mobile no." className='py-1 ms-2'
      autoFocus = "autofocus"
      ref = {contactNoRef}
      //  value={ContactNo}
      value={contactNoRef.current}
        style={{width:'200px'}}
         onChange={e => {
           //setContactNo(e.target.value)  
           contactNoRef.current = e.target.value
         }
         }
        />  
      </FormGroup>
        </div>  
      )
    }
     useEffect(() => {
      const favicon = document.getElementById("favicon");
      if (imageUrl) favicon.href = imageUrl
     }, [imageUrl])

    useEffect(() => {
       setOTP(OTP1 + OTP2 + OTP3 + OTP4)
       //console.log(OTP1 + OTP2 + OTP3 + OTP4)
       
       if (OTP1 && OTP2 === '')  setTimeout(() => inputOTP2Ref.current.focus(), 0)
       if (OTP2 && OTP3 === '')  setTimeout(() => inputOTP3Ref.current.focus(), 0)
       if (OTP3 && OTP4 === '')  setTimeout(() => inputOTP4Ref.current.focus(), 0)
    }, [OTP1, OTP2, OTP3, OTP4])

    const OTPModalContent = () =>{
      return (
         <Fragment>
          <div className="d-flex justify-content-center">  
            <Label for="otp1" style={{width:'70px'}}> OTP </Label> 
            <Input type="number" name="otp1" id="otp1" 
             innerRef={inputOTP1Ref}
             maxLength="1"
            value={OTP1}
             className='p-0 mx-1' 
            style={{textAlign:'center', width:'50px'}}  
              onChange = {e => {
                //inputOTP2Ref.current.focus()
                //setTimeout(() => inputOTP2Ref.current.focus(), 0)
               setErrorMessageOTP('') 
                setOTP1(() => e.target.value)
                handleEnter(e)
               }}
             />  
            <Input type="number" name="otp2" id="otp2" 
             value={OTP2}
             innerRef={inputOTP2Ref}
              
             placeholder=""  maxLength="1" className='p-0 m-0'
             style={{textAlign:'center', width:'50px'}} 
             onChange = {e => {
            
            setErrorMessageOTP('') 
              setOTP2(e.target.value)
              handleEnter(e)
            }}
             />  
            <Input type="number" name="otp3" id="otp3" 
             value={OTP3}
             innerRef={inputOTP3Ref}
             placeholder=""  maxLength="1" className='p-0 mx-1'
             style={{textAlign:'center', width:'50px'}} 
             onChange = {e => {
             setErrorMessageOTP('') 
              setOTP3(e.target.value)
              handleEnter(e)
            }}
             />  
            <Input type="number" name="otp4" id="otp4" 
             value={OTP4}
             innerRef={inputOTP4Ref}
             placeholder=""  maxLength="1" className='p-0 m-0'
             style={{textAlign:'center', width:'50px'}} 
             onChange = {e => {
              setOTP4(e.target.value)
               setErrorMessageOTP('') 
              //console.log(OTP) 
            }
          }
             />  
        </div>
        <p style={{fontSize:'11px', color:'red'}}>{errorMessageOTP}</p> 
        <div className="d-flex justify-content-center m-0">
           <p><small>Resend OTP after {otpExpiryDuration && <Countdown date={countDown} 
             renderer={renderer}
             intervalDelay={0}
             precision={3}
            // autoStart ={true}
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
          
                    <div style={{
                     borderRadius:'3px',
                     height:'10px',
                     paddingBottom:'2px',
                     fontSize:'15px'
                   }}>
                   {(modalTitle !== 'OTP' && modalTitle !== 'Your Booking Success') && modalTitle}
                  
                     </div> 
            
             
            <div style={{padding:'5px', marginTop:'10px'}}>
               {modalContent}
               {modalTitle === 'OTP' && <OTPModalContent />}
               {modalTitle === 'Your Contact No' && <LoginModalContent />}
               {modalTitle === 'Your Booking Success' && <SaveModal />}
               {modalTitle === 'Select a Location' && <PropertyModal />} 
               {modalTitle === 'Select a Restaurant' && <SelectRestaurant />}
               <p style={{color:'red', fontSize:'11px'}}>{modalErrorRef.current}</p>
            </div>
            <div  
              className="d-flex justify-content-end "> 
              {modalTitle === 'Your Contact No' && <Button style={{backgroundColor:'black'}}
                   onClick={() => { 
                    setContactNo(contactNoRef.current)
                  //  if (ContactNo.length !== 10) {
                    if (contactNoRef.current.length !== 10) {
                     // setModalErrorMessage('Kindly Enter Valid Mobile No')
                     modalErrorRef.current = 'Kindly Enter Valid Mobile No'
                       // setModalError(!modalError)
                    }else {
                     // setModalErrorMessage('')
                     modalErrorRef.current = ''
                       otpHandler()
                       setModalTitle('OTP')
                    //setModalOpened(!modalOpened) 
                  }
                  
                    }}
              > Continue</Button>}
             
              {modalTitle === 'OTP' && <Button 
             style={{backgroundColor:'black'}}
              onClick={() => {
               otpValidateHandler()
            }}
              >
              Login
            </Button> }
            </div>
          </Modal> 
        </div>
      )
    }
    useEffect(() => {
       
          if(modalTitle === 'Select a Restaurant') { 
            setModalContent('') 
              openModalLink()
          } else if(modalTitle === 'Select a Location') { 
              setModalContent('')
              openModalLink()
          } else if (modalTitle === 'Your Contact No') {
             setModalContent('')
             openModalLink()
          } else if (modalTitle === 'OTP') { 
            setErrorMessageOTP('')
           setModalContent('')
            openModalLink()
         } else if (modalTitle === 'Your Booking Success') {
            setModalContent('')
           openModalLink() 
         }else if (modalTitle.length > 5) {
          setModalContent(<ErrorModal />)
          openModalLink() 
         } else {
          closeModalLink()
         }  
         
    }, [modalTitle])

    const viewPageHandler = () => {
      reDirect.current = true
      //console.log(remarks.split('|'))
      setReservationId(remarks.split('|')[1])
      setBookingType(remarks.split('|')[0])
    //  console.log(remarks.split('|')[0]) 
        navigate("/view", {replace: true, state: { BookingId: remarks.split('|')[1], BookingType: remarks.split('|')[0]}}) 
    }

    const viewTableBooking = () => { 
      reDirect.current = false
    //  document.title = imageUrl + '- Table Booking'
      const paramsData = JSON.parse(sessionStorage.getItem('paramData'))
       console.log(paramsData)
       // console.log(OrganizationId)
       if (!OrganizationId) setOrganizationId(paramsData.organizationId)
       if (!PropertyId) setPropertyId(paramsData.propertyId)
       if (!propertyName) setPropertyName(paramsData.propertyName)
       if (!OutletCode) setOutletCode(paramsData.outletCode)
       if (!outletName) setOutletName(paramsData.outletName)
       if (!imageUrl)  setImageUrl(paramsData.imageUrl)
       console.log(PropertyId, propertyName, OutletCode, outletName)
    }

    // URL redirection process ...
    useEffect(() => {
      //console.log(location.state, loc)
      //console.log({organizationId:OrganizationId, propertyId:PropertyId, propertyName:propertyName, outletCode:OutletCode, outletName:outletName, imageUrl:imageUrl, remarks:remarks})
       if (!sessionStorage.getItem('paramData') && OrganizationId) {
                     // console.log(window.location.href)
                     // console.log(JSON.stringify({organizationId:OrganizationId, propertyId:PropertyId, propertyName:propertyName, outletCode:OutletCode, outletName:outletName, imageUrl:imageUrl, remarks:remarks}))
                      sessionStorage.setItem('paramData',JSON.stringify({organizationId:OrganizationId, propertyId:PropertyId, propertyName:propertyName, outletCode:OutletCode, outletName:outletName, imageUrl:imageUrl}))
                     if (remarks) {  
                       sessionStorage.setItem('paramData',JSON.stringify({organizationId:OrganizationId, propertyId:PropertyId, propertyName:propertyName, outletCode:OutletCode, outletName:outletName, imageUrl:imageUrl, remarks:remarks}))
                          viewPageHandler()
                       } else {
                          viewTableBooking()
                         navigate("/table-booking", { replace: true})
                    } 
        } else {    
          const paramsData = JSON.parse(sessionStorage.getItem('paramData'))
        //  console.log(remarks)
         // console.log(paramsData.remarks)
                 if (remarks && !loc.LinkClick) { 
                    sessionStorage.setItem('paramData',JSON.stringify({organizationId:OrganizationId, propertyId:PropertyId, propertyName:propertyName, outletCode:OutletCode, outletName:outletName, imageUrl:imageUrl, remarks:remarks}))
                    reDirect.current = true
                 // console.log(paramsData.remarks.split('|'))
                  //setReservationId(paramsData.remarks.split('|')[1])
                  //setBookingType(paramsData.remarks.split('|')[0])
                /   console.log(paramsData.remarks.split('|')[0]) 
                  navigate("/view", { replace: true, 
                    //state: {BookingId: remarks.split('|')[1], bookingType: remarks.split('|')[0]}
                  }
                  )
                 } else { 
                 navigate("/table-booking", {replace: true}) 
                  viewTableBooking()
                }
       //  console.log(JSON.parse(sessionStorage.getItem('paramData'))) 
      
       // console.log(paramsData) 
        } 
        // return () => sessionStorage.removeItem('paramData') 
      
     }, [])

     //disabled param data

     useEffect(() => {
         if (sessionStorage.getItem('paramData')) {
              const sess = JSON.parse(sessionStorage.getItem('paramData'))
              console.log(sess)
              if (!OrganizationId) setOrganizationId(sess.organizationId)
              if (!PropertyId) setPropertyId(sess.propertyId)
              if (!OutletCode) setOutletCode(sess.outletCode)
              if (!outletName) setOutletName(sess.outletName)
              if (!imageUrl) setImageUrl(sess.imageUrl)
              console.log(PropertyId, propertyName, OutletCode, outletName)
         }
    //  JSON.stringify({organizationId:OrganizationId, propertyId:PropertyId, propertyName:propertyName, outletCode:outletcode, outletName:outletName, imageUrl:imgurl})) 
     }, [sessionStorage.getItem('paramData')])

    const handleEnter = (event) => {
      event.preventDefault()
      if (event.target.value.length > 0) {
        const form = event.target
      //  console.log(form.id)
       //if (form.id === 'otp1') document.getElementById('otp2').focus()
      // if (form.id === 'otp2')  setTimeout(() => inputOTP3Ref.current.focus(), 0)
      // if (form.id === 'otp3') document.getElementById('otp4').focus() 
      //  console.log(inputOTP2Ref.current.focus)
       // inputOTP2Ref.current.focus();
     //  form.focus()
       // const index = [...form].indexOf(event.target);
       // form.elements[index + 1].focus();
      
      }
    };
 
   useEffect(() => { 
     //https://dev.lucidits.com/LUCIDPOSIntegrationAPI/V1/GetGuestAppToken
     //?OrganizationId=<<OrganizationId>>&PropertyId=<<PropertyId>>&TokenKey=<<TokenKey>>
    // console.log(tokenRef.current, reDirect.current)
    if (OrganizationId && reDirect.current === false) { 
       axios.get(`${process.env.REACT_APP_BASE_API_URL}LUCIDPOSIntegrationAPI/V1/GetGuestAppToken`,
       {
       params:{
        OrganizationId,
        PropertyId : (PropertyId === 'NONE' ||  PropertyId === '') ? null : PropertyId,
        TokenKey :"A519618A-7218-4375-AC2B-34811ED6AD37"
       },
        // headers: { Authorization: `Bearer ${userData.lucidapiToken}`},
        "Content-Type": "application/json"
      } 
       ).then((response) => { 
       setTokenData(response.data.response)
       sessionStorage.setItem('tokenData', JSON.stringify(response.data.response))
      //console.log(response.data.response)
     }).catch(error => console.log(error))
     }
     tokenRef.current = false
    // console.log([PropertyId, propertyName, OutletCode, outletName])
    }, [OrganizationId, PropertyId])

    useEffect(() => {
      (!tokenData ? tokenRef.current = true : tokenRef.current = false) 
     // console.log(tokenRef.current, tokenData)
 }, [tokenData])

   const getPropertyHandler = () =>{
    // curl --location --request GET 'https://dev.lucidits.com/LUCIDPOSGuestTableReservationAPI/V1/GetPropertyList'
     axios.get(`${process.env.REACT_APP_LUCIDPOS_GUEST_TABLE}GetPropertyList`, {
      headers: { Authorization: `Bearer ${tokenData.token}`},
      "Content-Type": "application/json"
     }
   ).then((response) => { 
      setPropertyList(response.data.response)
     //console.log(response.data.response)
   }).catch(error => console.log(error))
   }

   useEffect(() => { 
     
       //GET 'https://dev.lucidits.com/LUCIDAPI/V1/GetMobileCountryCode'
        if (tokenData) { 
          //toggleRef.current = false
           getPropertyHandler()  
          axios.get(`${process.env.REACT_APP_BASE_API_URL}LUCIDAPI/V1/GetMobileCountryCode`,
         { 
       headers: { Authorization: `Bearer ${tokenData.token}`},
       "Content-Type": "application/json"
       } 
      ).then((response) => { 
       setMobileCountryCodeData(response.data.response)
       const list = response.data.response
     setOptionsTelephoneCode(() => list.mobileCountryCodeList.map(code => ({value:code.countryCode, label : code.telephoneCode})))
   // console.log(response.data.response)
      }).catch(error => console.log(error))

     // GET 'https://dev.lucidits.com/LUCIDAPI/V1/GetTitleList'
     axios.get(`${process.env.REACT_APP_BASE_API_URL}LUCIDAPI/V1/GetTitleList`,
     { 
     headers: { Authorization: `Bearer ${tokenData.token}`},
     "Content-Type": "application/json"
     } 
    ).then((response) => { 
    setTitleListData(response.data.response)
    const list = response.data.response
    setOptionsTitle(() => list.titleList.map(title => ({value:title.titleId, label : title.titleName})))
   // console.log(response.data.response)
    }).catch(error => console.log(error))
  }
    
    }, [tokenData])


   useEffect(() => {
   if ((!PropertyId || PropertyId === "NONE") && (propertyList && propertyList.propertyList.length === 1))  {
        setModalOutlet(false) 
       // const propertyArray = propertyList.propertyList.map(item => item).filter(property => property)
      //  setPropertyName(propertyArray[0].propertyName) 
      //  setPropertyId(propertyArray[0].propertyId) 
      //  console.log(propertyArray)
        closeModalLink()  
        const propertyNames = propertyList.propertyList.map(item => item.propertyName).filter(property => property)
        const propertyIds = propertyList.propertyList.map(item => item.propertyId).filter(property => property)   
        setPropertyId(propertyIds[0]) 
        setPropertyName(propertyNames[0])
        document.title = propertyNames[0] + '- Table Booking'
      //console.log(outleListData.outletList.map(item => item.outletName)[0], outleListData.outletList.map(item => item.outletCode)[0])
    // } //else if ((propertyName === "" && PropertyId) && propertyList.propertyList.length > 1) {
       //  setModalTitle("Select a Location") 
       //  setPropertyCount(propertyList.propertyList.length)
       // const propertyArray = propertyList.propertyList.map(item => {
       //  if (PropertyId === item.propertyId) return item.propertyName 
       // }).filter(property => property) 
       //   console.log(propertyArray)
       //if (propertyList)
       //setPropertyName(propertyArray[0]) 
       //document.title = propertyArray[0] + '- Table Booking'
       // console.log(propertyArray)
    } else if ((PropertyId === "NONE" || !PropertyId) && (propertyList && propertyList.propertyList.length > 1)) 
       { 
       setModalTitle("Select a Location")  
      console.log(PropertyId)
    } 
    if (propertyName === '' && (PropertyId !== 'NONE' && PropertyId) && propertyList && propertyList.propertyList.length ) {
      console.log(propertyList.propertyList.length)
      propertyList.propertyList.forEach(item => {
          if (PropertyId === item.propertyId) setPropertyName(item.propertyName)
         })
    }
     //if (propertyList && PropertyId) {
     //  const area = propertyList.propertyList.filter(item => item.propertyId === PropertyId)
     //  setAreaName(area.areaName)
     //  setCityName(area.cityName)
     //  console.log(area)
     //}
     console.log(PropertyId)
      if (propertyList)  setPropertyCount(propertyList.propertyList.length)
     }, [propertyList])

     useEffect(() => {
          if (propertyName)  document.title = propertyName + '- Table Booking'  
     }, [propertyName])
 
     const getOutletListHandler = () => {
      //curl --location --request GET 'https://dev.lucidits.com/LUCIDPOSGuestTableReservationAPI/V1/GetOutletList?PropertyId=10000000011000000001'
     axios.get(`${process.env.REACT_APP_LUCIDPOS_GUEST_TABLE}GetOutletList`, {
      params:{
        PropertyId
      },
      headers: { Authorization: `Bearer ${tokenData.token}`},
       "Content-Type": "application/json"
      }
     ).then((response) => { 
      //setTokenData(response.data.response)
     // console.log(response.data.response)
      const outleListData = response.data.response 
      setOutletList(response.data.response)
      // console.log(outleListData)
     
    }).catch(error => console.log(error))
     }
 
      useEffect(() => {
      if (tokenData && (PropertyId !== "NONE" && PropertyId)) getOutletListHandler() 
        // return () => toggleRef.current = false 
      }, [PropertyId, tokenData])
 
    useEffect(() => {
      //GET 'https://dev.lucidits.com/LUCIDPOSGuestTableReservationAPI/V1/
      //GetOutletDetails?OutletCode=TERC'
        if (OutletCode && outletList.token) {
          sessionStorage.setItem('outletListToken',outletList.token)
          //console.log(outletList.token)
          axios.get(`${process.env.REACT_APP_LUCIDPOS_GUEST_TABLE}GetOutletDetails`, {
            params:{
              OutletCode
            },
            headers: { Authorization: `Bearer ${outletList.token}`},
             "Content-Type": "application/json"
            }
         ).then((response) => { 
            //setTokenData(response.data.response)
           // console.log(response.data.response)
            setOutletData(response.data.response)
         }).catch(error => console.log(error))
        }
        
    }, [OutletCode, outletList])

  useEffect(() => {
     if (outletData) {
      outletData.outletDetails.maximumPax && setMaxPax(Number(outletData.outletDetails.maximumPax))
       //toggleRef.current = false
     }
     
  }, [outletData])
   
  useEffect(() => {  
        if (outletList && (!outletName || !OutletCode)) { 
              if (outletList.outletList.length === 1 ) { 
                     console.log(outletList, OutletCode)   
                         //  setOutletName(outletArray[0].outletName) 
                         //  setImageUrl(outletArray[0].imageUrl) 
                         const imgurl = outletList.outletList.map(item => item.imageUrl)[0]
                         const outletname = outletList.outletList.map(item => item.outletName)[0]
                         const outletcode = outletList.outletList.map(item => item.outletCode)[0]

                         closeModalLink()
                         setImageUrl(imgurl)
                         setOutletName(outletname)
                         setOutletCode(outletcode)
                         sessionStorage.setItem('paramData',JSON.stringify({organizationId:OrganizationId, propertyId:PropertyId, propertyName:propertyName, outletCode:outletcode, outletName:outletName, imageUrl:imgurl})) 
              }  else if (outletList.outletList.length > 1) {  
         // console.log(outletArray)    
          console.log(outletList, OutletCode)
         setModalTitle('Select a Restaurant') 
       }}
        //  if (outletList && outletList.outletList.length === 1)  {
        //   //setModalOutlet(false)
        //    closeModalLink()
        //    setImageUrl(outletList.outletList.map(item => item.imageUrl)[0])
        //    setOutletName(outletList.outletList.map(item => item.outletName)[0])
        //    setOutletCode(outletList.outletList.map(item => item.outletCode)[0])
        //    sessionStorage.setItem('paramData',JSON.stringify({organizationId:OrganizationId, propertyId:PropertyId, propertyName:propertyName, outletCode:outletList.outletList.map(item => item.outletCode)[0], outletName:outletList.outletList.map(item => item.outletName)[0], imageUrl:outletList.outletList.map(item => item.imageUrl)[0]}))
        //   //console.log(outleListData.outletList.map(item => item.outletName)[0], outleListData.outletList.map(item => item.outletCode)[0])
        //} // else if (outletList) {
        // setImageUrl('')
        // setOutletCode('')
        // setOutletName('')
        // setModalTitle('Select a Restaurant')
        // }  
       if (outletList) setOutletCount(outletList.outletList.length)
       
     // return () => closeModalLink()
  }, [outletList])
 
  useEffect(() => {
     // GET 'https://dev.lucidits.com/LUCIDPOSGuestTableReservationAPI/V1/GetTimeSlotList?OutletCode=TERC&BookingDate=04-Aug-2022'
   if (outletList.token && OutletCode && bookingDate) axios.get(`${process.env.REACT_APP_LUCIDPOS_GUEST_TABLE}GetTimeSlotList`, {
      params:{
        OutletCode,
        BookingDate:bookingDate
      },
      headers: { Authorization: `Bearer ${outletList.token}`},
       "Content-Type": "application/json"
      }
   ).then((response) => { 
   // console.log(OutletCode, bookingDate)
      //setTokenData(response.data.response)
   // console.log(response.data)
    setTimeSlotList(response.data.response)
     
   }).catch(error => console.log(error))
   //console.log(OutletCode, bookingDate, outletList.token) 
  }, [outletList.token, OutletCode, bookingDate])
 
   
  const SaveModal = () => {
    return ( 
       <Fragment>
        <Row>
        <Col>
        <div className="d-flex justify-content-center m-0">
         <div style={{border:'solid  green'}}>
          <Check color="green" size={50} strokeWidth='5px'/> 
         </div>  
        </div>
        <div className="d-flex justify-content-center m-0">
        <p><small>Your Booking is Success</small></p>
         </div>  
        </Col>
      </Row>
       <Row>
         <Col>
         <div className="justify-content-center text-center"> 
           <p className="lh-1 m-0" >{outletName}</p> 
           <p  className="lh-1 mt-0">{propertyName}</p> 
           <p className="lh-1 m-0">Date : {dateFormat(bookingDate, "dd-mm-yyyy")}</p> 
             <p className="lh-1 m-0">Time : {BookingTime}</p>
           <p className="lh-1 mt-0">Guests : {NoOfGuest}</p>
           <p className="lh-1 m-0 fs-6 fw-bold text-primary"> Booking Status: Waiting  </p> 
           <p className="lh-1 m-0 fs-6"><small>[Restaurant will update your booking status soon]</small></p> 
         </div>
         </Col> 
       </Row>  
      </Fragment> 
   )
 }
 useEffect(() =>{
  if (saveToggle) {  
     setBookingDate(d.toISOString().split('T')[0])
     setNoOfGuest(1)
     setBookingTime('')  
  }
//return () =>   setBookingHandlerToggle(fas)
 return () => setSaveToggle(false)
 }, [saveToggle])
 const ErrorModal = (props) =>{
  return (
   
   <div className="d-flex justify-content-center m-0">
        <p style={{color:'red'}}>{props.message}</p>
    </div>
    
 )
}
  useEffect(() => {
    if (selectedTitle) {
      setGuestTitle(selectedTitle[0].label)
      setGuestTitleId(selectedTitle[0].value)
      //console.log(selectedTitle[0].label, selectedTitle[0].value)
    } 
     
  }, [selectedTitle])

  useEffect(() => {
    if (selectedTelephoneCode) {
      setContactNoCountryCode(selectedTelephoneCode[0].label)
      //ser(selectedTelephoneCode[0].value)
     // console.log(selectedTitle[0].label, selectedTitle[0].value)
    } 
    // console.log(selectedTelephoneCode)
  }, [selectedTelephoneCode])
 
  const otpHandler = () => {
     // GET 'https://dev.lucidits.com/LUCIDAPI/V1/SendOTP?OTPFor=4&MobileNo=9738854149'
     if ((!loggedIn && ContactNo) || (ContactNo !== contactDetails.contactNo)) axios.get(`${process.env.REACT_APP_BASE_API_URL}LUCIDAPI/V1/SendOTP`,
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
   useEffect(() => {
    if (otpExpiryDuration) setCountDown(Date.now() + otpExpiryDuration)
   }, [otpExpiryDuration])

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
           closeModalLink()
         !bookingHandlerToggle && setModalTitle("Loging Success")
                 !bookingHandlerToggle && setTimeout(() => {
            closeModalLink()
           }, 500);
           //if (modalOpened) setModalOpened(!modalOpened)
          // setModalOTP(false)
           localStorage.setItem('contactDetails',JSON.stringify({contactNo:ContactNo, firstName: FirstName, lastName: LastName, loggedIn:true}))
          if (diffNo) setBookingHandlerToggle(true)
          document.body.style.overflow = "visible"
          }
        if (res.data.errorCode === 1) {
          setErrorMessageOTP('Invalid OTP') 
          
        }
       }) 
   }
  
    useEffect(() => {
      if ((loggedIn && bookingHandlerToggle && BookingTime)){
        axios.post(`${process.env.REACT_APP_LUCIDPOS_GUEST_TABLE}ValidateTableBooking`, 
        {
          OutletCode,
          "BookingDate":bookingDate, // "04-Aug-2022",
          "BookingTime":moment(BookingTime, ["h:mm A"]).format("HH:mm"), // "16:00",
          NoOfGuest, // 10,
          GuestDetails:{
              GuestTitleId,
              GuestTitle, //: "Mr.",
              FirstName, //: "Yuvi",
              LastName, //": "A",
              ContactNoCountryCode, // ": "91",
              ContactNo, //": "9738854149",
              EmailId //": "yuvi@lucidits.com"
          },
          Instruction,
       }, {
       headers: { Authorization: `Bearer ${outletList.token}`}}
     ).then(response => {
      if (response.data.errorCode === 1) {
        setModalTitle(response.data.message)
        setBookingHandlerToggle(false)
      }
      if (response.data.errorCode === 0) {
        axios.post(`${process.env.REACT_APP_LUCIDPOS_GUEST_TABLE}SaveTableBooking`, 
        {
          OutletCode,
          "BookingDate":bookingDate, // "04-Aug-2022",
          "BookingTime":moment(BookingTime, ["h:mm A"]).format("HH:mm"), // "16:00",
           NoOfGuest, // 10,
           GuestDetails:{
              GuestTitleId,
              GuestTitle, //: "Mr.",
              FirstName, //: "Yuvi",
              LastName, //": "A",
              ContactNoCountryCode, // ": "91",
              ContactNo, //": "9738854149",
              EmailId //": "yuvi@lucidits.com"
          },
          Instruction,
       }, {
       headers: { Authorization: `Bearer ${outletList.token}`}}
     ).then(res => {
      if (res.data.errorCode === 0) { 
      setBookingHandlerToggle(false)
     // setModalTitle('')
      setModalTitle('Your Booking Success')
      //setModalSave(!modalSave)
      if (isOpenBL) getGuestListHandler()
    }
 
    })
      }
     })
      }  
    
    }, [loggedIn, bookingHandlerToggle])


  const bookingSubmitHandler = () => {
        
        //   curl --location --request POST 'https://dev.lucidits.com/LUCIDPOSGuestTableReservationAPI/V1/ValidateTableBooking' \
        //-header 'Content-Type: application/json' \
        //-data-raw '{
        //   "OutletCode": "TERC",
        //   "BookingDate": "04-Aug-2022",
        //   "BookingTime": "16:00",
        //   "NoOfGuest": 10,
        //   "GuestDetails":{
        //       "GuestTitleId": 1,
        //       "GuestTitle": "Mr.",
        //       "FirstName": "Yuvi",
        //       "LastName": "A",
        //       "ContactNoCountryCode": "91",
        //       "ContactNo": "9738854149",
        //       "EmailId": "yuvi@lucidits.com"
        //   },
        //   "Instruction": "",
        //   "SystemDetails":{
        //       "ApplicationName":"",
        //		"ApplicationVersion":"1.0",
        //		"BrowserName":"",
        //		"BrowserVersion":"",
        //		"DeviceId":"",
        //		"DeviceType":"Tab",
        //		"IP":"",
        //		"Mac":"",
        //		"OPS":"",
        //		"Source":"TabletPOS",
        //		"SystemName":"Yuvaraj",
        //		"SystemTimeZoneId":1
        //   }
        //'
        if (!BookingTime) {
            setModalTitle('Kindly select Booking Time')
            // setModalError(!modalError)
        }  else if (!FirstName) {
          setModalTitle('Kindly Enter Your Name')
         // setModalError(!modalError)
        } else if (!ContactNo || ContactNo.length !== 10) {
          setModalTitle('Kindly Enter Valid Contact No.')
          //setModalError(!modalError)
        } else if (contactDetails && (ContactNo !== contactDetails.contactNo)) { 
               
                 clearOTPInput()
                 otpHandler ()
                // setErrorMessageOTP('')
                 setModalTitle('OTP')
               // setModalOTP(!modalOTP)
                setDiffNo(true) 
              } else if (!loggedIn) {
                clearOTPInput()
                otpHandler()
                setModalTitle('OTP') 
                setBookingHandlerToggle(true)  
              }else {  
                 // otpHandler ()
                //  setErrorMessageOTP('')
                  setBookingHandlerToggle(true)    
                  //alert(contactDetails.contactNo)  
        } 
 }
     const getGuestListHandler = () => {
        //GET 'https://dev.lucidits.com/LUCIDPOSGuestTableReservationAPI/V1/GetGuestTotalBooking?ContactNo=9738854149'
        axios.get(`${process.env.REACT_APP_LUCIDPOS_GUEST_TABLE}GetGuestTotalBooking`, {
          params:{
            ContactNo
          },
          headers: { Authorization: `Bearer ${outletList.token}`},
           "Content-Type": "application/json"
          }
       ).then((res) =>{
         setTotalBooking(res.data.response.totalBooking)
         //console.log(res)
       })
       //GET 'https://dev.lucidits.com/LUCIDPOSGuestTableReservationAPI/V1/GetGuestTableBookingList?CurrentPageNumber=10&NoOfRowsPerPage=1&ContactNo=9738854149'
       axios.get(`${process.env.REACT_APP_LUCIDPOS_GUEST_TABLE}GetGuestTableBookingList`, {
        params:{
          CurrentPageNumber:currentPage,
          NoOfRowsPerPage:10,
          ContactNo
        },
        headers: { Authorization: `Bearer ${outletList.token}`},
         "Content-Type": "application/json"
        }
     ).then((res) =>{
      // console.log(res.data)
       setGuestTableBookingList(res.data.response)
     })
     }

    useEffect(() => {
            if(isOpenBL) {
               getGuestListHandler()
               document.body.style.overflow = "visible"
            }
        }, [isOpenBL, currentPage])

        
        const cancelHandler = (propertyId, bookingId) => {
             //  POST 'https://dev.lucidits.com/LUCIDPOSGuestTableReservationAPI/V1/ValidateCancelTableBooking' \
             //   --header 'Content-Type: application/json' \
             // --data-raw '{
             // "PropertyId": "10000000011000000001",
             // "OutletCode": "TERC",
             // "BookingId": "",
             // "ContactNo": "9738854149",
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
             //  }
             // }'
             
             axios.post(`${process.env.REACT_APP_LUCIDPOS_GUEST_TABLE}ValidateCancelTableBooking`, 
             {
              PropertyId:propertyId,
              OutletCode,
              BookingId:bookingId,
              ContactNo 
               }
            , {
            headers: { Authorization: `Bearer ${outletList.token}`}}
          ).then(res => {
         //   console.log(res.data)
            if (res.data.errorCode === 0) {
           //    curl --location --request POST 'https://dev.lucidits.com/LUCIDPOSGuestTableReservationAPI/V1/CancelTableBooking' \
           //    --header 'Content-Type: application/json' \
           //  --data-raw '{
           // "PropertyId": "10000000011000000001",
           // "OutletCode": "TERC",
           // "BookingId": "",
           // "ContactNo": "9738854149",
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
           axios.post(`${process.env.REACT_APP_LUCIDPOS_GUEST_TABLE}CancelTableBooking`, 
           {
            PropertyId:propertyId,
            OutletCode,
            BookingId:bookingId,
            ContactNo 
             }
          , {
          headers: { Authorization: `Bearer ${outletList.token}`}}
         ) 
            }
          }).then(() => {   
             setSpinnerToggle(bookingId)
            setTimeout(() => {  
              setSpinnerToggle('') 
              getGuestListHandler()}, 1000 ) 
              setBookingHandlerToggle(false)  
          }) 
           } 
 
           const renderer = ({minutes, seconds }) => {
            return <span>{minutes}:{seconds}</span>
           }     
       useEffect(() => {
        // console.log([PropertyId, propertyName, OutletCode, outletName])
       }, [PropertyId, propertyName, OutletCode, outletName])

  return(
     <Container fluid  className="m-0" style={isTabletOrMobile ? {backgroundColor:'white', fontSize:'12px'} : {backgroundColor:'white', minHeight:'700px'}}>
        <Row>
            <Col>
            <Card className='shadow-1-strong' style={{boxShadow:'rgba(0, 0, 0, 0.10) 0px 5px 15px', margin:'10px', border:'none'}}>
            <CardHeader 
            className=' text-dark fixed-top mb-5' 
            style={{border:'none', background:'#EAEAEA'}}>
            <div style={{float:'right', display:'flex', justifyContent: 'right', width:'15%'}}> 
            <div style={isTabletOrMobile ? {float: "right", position:'absolute', fontSize:'12px'} : {float: "right", position:'absolute'}}>{ loggedIn ? <Link to= ""  className='text-dark pe-1'
             onClick ={() => {
            //  sessionStorage.clear()
              localStorage.clear()
              setContactNo('')
              setFirstName('')
              setLastName('')
              setLoggedIn(false)
              setGuestTableBookingList('')
              setTotalBooking('')
              setIsOpenBL(false)
             }}
            >Logout</Link> :
              <Link to =""  className='text-dark pe-1' onClick={() => {
                setModalTitle('Your Contact No')
                clearOTPInput()
              }
              }>Login</Link>
            }</div>
            </div>
            {
             // Left Side Logout
            }
           <div style={{float:'left', display:'flex', width:'85%'}}>
             {(imageUrl && <img src= {imageUrl} className=" rounded float-start img-fluid" alt="..." 
               style={isTabletOrMobile ? {maxwidth:'100px', maxHeight:'60px'} : {maxHeight:'70px', maxWidth:'200px'}}
              /> )||<Image size={50}/>
              }
              <div style={isTabletOrMobile ? {display:'flex', flexDirection:'column', paddingTop:'15px', fontSize:'12px'} : {display:'flex', flexDirection:'column', paddingTop:'15px'}}>
             <span className="ps-2">{outletName}{ outletCount > 1 && <Link to="" onClick={ ()=> {
              getOutletListHandler() 
              setModalOutlet(!modalOutlet) 
              setModalTitle('Select a Restaurant')
             }} 
               style={{color:'#2ECC71', textDecoration:'none', padding:'1px'}}
             >{' '}<Edit size={15} /></Link>} </span> <span className="ps-2">{propertyName}{ propertyCount > 1 && <Link to="" onClick={ ()=> {
              getPropertyHandler()
              //setModalProperty(!modalProperty)
              setModalTitle('Select a Location')
            }}
             style={{color:'#2ECC71 ', textDecoration:'none' }} 
             >{' '}<Edit size={15}/></Link>}</span>
           </div> 
           {
            // Right Side Logout
           }
            </div> 
        </CardHeader>
        {(!propertyName && !outletName) && <Spinner animation="grow" variant="primary" />}
        { PropertyId && OutletCode &&
         <CardBody 
          style={{backgroundColor:'white', border:'none', paddingTop:'80px'}}>{
              //left head starts here
           }
            <Row className="d-flex justify-content-center">
               <Col md={5} sm={5}>
               <Row>
               <Col md={3} sm={5} style={isTabletOrMobile ? {maxWidth:'50%'} : { width:'40%'}}>
               <Label for="date" style={ {width:'75px'}}>Date: *</Label> 
                <Input type='date' className='p-1' name='date' required
                 style={isTabletOrMobile ? {fontSize:'11px', width:'100%', height:'30px'} : {width:'185px'}}
                 value={bookingDate}
                 min = {d.toISOString().split('T')[0]}
                 onChange={e => {
                  setBookingDate(e.target.value)
                // console.log(`${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`, d.toISOString().split('T')[0])
                }} 
            />
               </Col>
               <Col sm={2} style={isTabletOrMobile ? { maxWidth:'50%'} : { width:'60%'}}>     
               <Label for="noofguest" style={isTabletOrMobile ? {width:'100px'} : {width:'110px', padding:'0px'}}>No of Guest: *</Label> 
               <Input type="number"
               // class="form-control"  
                style={isTabletOrMobile ? {fontSize:'11px', width:'100%'} : {height:'35px',  width:'175px'}}
                value= {NoOfGuest}
                min = {1}
                max={maxPax}
                onChange={ e => {
                  if (e.target.value > maxPax) setModalTitle(`Maximum booking available is ${maxPax}`)
                  setNoOfGuest(e.target.value)
                 }}   
              />  
                </Col> 
                </Row>
                <Row className='mt-3' style={{display:'flex', flexDirection:'row'}}>
                <Col sm ='10' style={isTabletOrMobile ? {maxWidth:'100%', fontSize:'11px', marginBottom:'15px'} : {}}>
                <Label for="time" style={isTabletOrMobile ? {width:'100px'} : {width:'60px', padding:'0px'}}>Time: *</Label>
                
               <div className='p-0 form-control text-center hvr' style={isTabletOrMobile ? {fontSize:'11px', maxWidth :'100%',  height:"130px", overflowY:'scroll', margin:'0px'} : {height:"195px", overflowY:'scroll'}}>
                  {!timeSlotList && <Loading />}
                 {timeSlotList && timeSlotList.timeSlotList.length === 0 && <p style={{color:'red'}}>No Slot Available for booking</p>}
                 {timeSlotList && timeSlotList.timeSlotList.map((time, id) =>{
                  
                  //console.log(time)
                     return (
                      <Button outline key={id} className="m-1" size={isTabletOrMobile ? "sm" :""}   
                      style={isTabletOrMobile ? {fontSize:'11px', backgroundColor: (BookingTime && (BookingTime === time.timeSlot && timeColor)), color:  (BookingTime &&(BookingTime === time.timeSlot && 'white'))} : {backgroundColor:  (BookingTime &&(BookingTime === time.timeSlot && timeColor)), color:  (BookingTime &&(BookingTime === time.timeSlot && 'white'))}}
                       onClick ={() => {
                       // console.log(BookingTime)
                        setBookingTime(time.timeSlot)
                        setTimeColor('black')
                       }}
                      // onLoad ={() =>   console.log(BookingTime, time.timeSlot)}
                      >{time.timeSlot}</Button>
                     )
                 })} 
                </div>
               </Col>  
                </Row>
               </Col>
               {
             //right head starts here
          }
               <Col md={5} sm={5} style={{paddingLeft:'10px'}} >
               <Row > 
               <Form>
               <Label for="name" style={isTabletOrMobile ? {width:'100px'} : {width:'130px'}}>Name : *</Label>
               <FormGroup row>   
               <Input type="select" name="title" id="name"  className='p-1 ms-2'   
               style={isTabletOrMobile ? {fontSize:'11px', width:'60px'} : {width:'60px'}}
               onChange={e => setSelectedTitle(optionsTitle.filter(item => item.label === e.target.value))}
                >
                   {optionsTitle && optionsTitle.map((field) => {
                      return (
                         <option key={field.value}>
                          {field.label}
                         </option>
                       )
                   })}
            </Input>
            <Input type="text" name="first" id="name1" placeholder="first name" className='py-1 ms-1 in-text' 
             onChange={e => setFirstName(e.target.value)}
             value={FirstName}
             style={isTabletOrMobile ? {fontSize:'11px', maxWidth:'36%'} : {width:'225px'}}
            /> 
              <Input type="text" name="second" id="name2" placeholder="last name" className='py-1 in-text ms-1'
            onChange={e => setLastName(e.target.value)}
            value={LastName}
            style={isTabletOrMobile ? {fontSize:'11px',  maxWidth:'36%'} : {width:'225px'}}
            />  
        </FormGroup>
        <Label for="name" style={isTabletOrMobile ? {width:'100px'} :{width:'130px'}}>Contact No : *</Label>
        <FormGroup row> 
            <Input type="select" name="tcode" id="tcode"  className='p-1 ms-2' 
            style={isTabletOrMobile ? {fontSize:'11px', width:'60px'} : {width:'60px'}}
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
            <Input type="number" name="mobile" id="mobile" placeholder="mobile no."
             style={isTabletOrMobile ? {fontSize:'11px', maxWidth:'36%'} : {width:'225px'}}
            value={ContactNo}
             className='py-1 ms-1 in-text' minLength={10} maxLength = {10} 
             onChange={e => setContactNo(e.target.value)}
            />   
        </FormGroup>
        <Label for="name" style={isTabletOrMobile ? {width:'100px'} : {width:'130px'}}>Email ID : </Label>   
        <FormGroup row> 
            <Input type="text" name="email" id="email" placeholder="emailid" className='py-1 ms-2 in-text' 
            style={isTabletOrMobile ? {fontSize:'11px', maxWidth:'95%'} : {width:'520px'}}
            onChange ={e => setEmailId(e.target.value)}/>    
        </FormGroup>
        {(outletData && outletData.outletDetails.enableInstruction) && <Label for="name" style={isTabletOrMobile ? {width:'100px'} : {width:'130px'}}>Instruction: </Label>}
         {(outletData && outletData.outletDetails.enableInstruction) && <FormGroup row> 
            <Input type="text" name="instruction" id="instruction" placeholder="instruction" className='py-1 ms-2 in-text'
                   style={isTabletOrMobile ? {fontSize:'11px', maxWidth:'95%'} : {width:'520px'}}
                  onChange = {e => setInstruction(e.target.value)}
          /> 
        </FormGroup>
        }
       </Form>      
       </Row>
        </Col> 
          </Row> 
        </CardBody> 
        }
        { propertyName && outletName &&
        <CardFooter style={{backgroundColor:'white', border:'none'}}>
           <Row  className ='d-flex justify-content-center' >
            <Col md='2' style={{ textAlign:'center'}}>
               <u style={{textUnderlineOffset: '5px'}}>Terms & Conditions</u> 
            </Col>
            </Row>
          <Row  className ='d-flex justify-content-center mb-3' > 
            <Col md='6' > 
            {outletData && outletData.outletDetails.enableInstruction &&
            <div style={{minWidth:'100px',  borderRadius:'5px', textAlign:'center'}} dangerouslySetInnerHTML = {{__html: outletData.outletDetails.termsAndConditions.map(item =>item.termsAndConditions)}}>
               {  //border:'solid 1px #ced4da',
                //outletData.outletDetails.termsAndConditions.map(item =>item.termsAndConditions)
               } 
            </div>
            }
            </Col>
          </Row>  
         <Row className='justify-content-center'>
          <Col sm={2} style={{ textAlign:'center', marginBottom:'15px'}}>
          <Button style={{backgroundColor:'black'}} onClick={ () => {
            bookingSubmitHandler()
           // setSaveToggle(true)
          }}>
            Book Table
          </Button>
          </Col> 
        </Row>
         <Row className="mb-1" >
          <Col sm={2} style={{paddingLeft:'25px'}}>
          {isOpenBL ? <MinusCircle size={20} className='pe-1'/> : <PlusCircle size={20} className='pe-1'/>} 
             <Link to="" 
             style={{color:'black'}}
              onClick = { () => {
               if (ContactNo.length !== 10) {
                setModalTitle('Kindly Enter Valid Mobile No')
               // setModalError(!modalError)
            } else if (!loggedIn) {
              setModalTitle('Kindly Login to View Bookings')
              //setModalError(!modalError)
             } else {
               setIsOpenBL(!isOpenBL)
             }
              }}
            >Your Bookings
            </Link>{totalBooking && <span>({totalBooking})</span>}<Link to=""
                style={{textDecoration:'none', color:'black'}}
               onClick = { () => {
                if (ContactNo.length !== 10) {
                  setModalTitle('Kindly Enter Valid Mobile No')
                 setModalError(!modalError)
                } else {
                getGuestListHandler()
                //console.log(ContactNo)
              }
               }}
            > {'  '}{totalBooking && <RefreshCcw size={14} strokeWidth='3px' />}</Link>
          </Col>
         </Row>
        <Row style={{boxShadow: 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px'}}>
          <Col>
          <Collapse isOpen={isOpenBL} >
            <div style={{minHeight:'300px'}}>
          <Table responsive striped size="sm" style={isTabletOrMobile ? {fontSize:'11px'} : {paddingLeft:'20px', paddingRight:'20px'}}>
          <thead>
          <tr>
            <th style={{width:'130px', textAlign:'center'}}>Location</th>
            <th style={{width:'70px'}}>Date</th>
            <th  style={{width:'60px'}}>Time</th>
            <th style={{textAlign:'center', width:'80px'}}>No of Guest</th>
            <th style={{width:'70px'}}>Status</th>
            <th style={{width:'70px'}}>View</th>
            <th style={{width:'90px'}}>Cancel</th> 
          </tr>
        </thead>
        <tbody>
          {!GuestTableBookingList && <tr><td colSpan={5} className='text-center'><Spinner animation="grow" variant="primary" /></td></tr>} 
         {
         (GuestTableBookingList && isOpenBL) && GuestTableBookingList.bookingList.map((item, id) => {
          //  console.log(item)
          return(
            <tr key={id}>
              <td className="ps-2">
                {item.location} 
              </td> 
              <td>
                {item.bookingDate}
              </td>
              <td>
                {item.bookingTime}
              </td>
              <td style={{textAlign:'center'}}>
                {item.noOfGuest}
              </td>
              <td>
                {item.status} 
              </td>
              <td>
                 <Link to='/view' style={{color:'black'}}
                 state={{OrganizationId, PropertyId:item.propertyId, BookingId: item.bookingId, OutletCode: item.outletCode, tokenData:tokenData}}
                 onClick={() =>  {
                  sessionStorage.setItem('paramData',JSON.stringify({organizationId:OrganizationId, propertyId:item.propertyId, propertyName: propertyName, outletName: outletName, outletCode:item.outletCode,imageUrl:imageUrl,}))
                //  console.log({OrganizationId, PropertyId:item.propertyId, BookingId: item.bookingId})
                }
              }
                 >View</Link>
              </td>
              <td>
                {item.allowCancel && <Link to="" onClick={() => {
                  cancelHandler(item.propertyId,item.bookingId) 
                  }
                  }>{(spinnerToggle === item.bookingId) ?
                    <div className="spinner-border text-danger spinner-border-sm" role="status"> 
                   </div> : 'Cancel' 
                  }</Link>}
              </td>
            </tr>
          )
         })
         }
         </tbody>
         </Table>
            </div>
         
         <div className={isTabletOrMobile ? "d-flex justify-content-center" :"d-flex justify-content-end pagin"} style={{width:'100%'}}>
          <div sm='2'> 
          <ReactPaginate  
            size ='sm'
            breakLabel="..."
            nextLabel=">"
            onPageChange={page => handlePagination(page)}
            forcePage={GuestTableBookingList && GuestTableBookingList.paginationDetail.currentPageNumber - 1}
            pageRangeDisplayed={5}
            pageCount={GuestTableBookingList && Math.ceil(GuestTableBookingList.paginationDetail.totalRecords / GuestTableBookingList.paginationDetail.noOfRowsPerPage)}
            previousLabel="<"
            renderOnZeroPageCount={null}
            activeClassName='active'
            pageClassName='page-item'
            breakClassName='page-item'
            pageLinkClassName='page-link'
            nextLinkClassName='page-link'
            breakLinkClassName='page-link'
            nextClassName='page-item next'
            previousLinkClassName='page-link'
            previousClassName='page-item prev'
            containerClassName='pagination react-paginate pagination-danger pagination-sm'
            style={{maxWidth:'50%'}}
           
          /> 
          </div>
         </div> 
            </Collapse>
          </Col>
        </Row>
        <Row className="d-flex justify-content-center border-top fixed-bottom" 
           style={{background:'#EAEAEA'}}>
           <div style={{width:'160px'}}>
              <small><em style={{fontSize:'11px', color:'#8D8D8D'}}>Powered by {' '}</em><Link to= "" 
              onClick={() => window.open('https://lucidpos.com/', '_blank')}
              style={{fontWeight:'normal', fontSize:'11px', color:'#8D8D8D'}}><strong>LUCID POS</strong></Link></small> 
            </div>
        </Row>
        </CardFooter>
        }
       </Card> 
       </Col>
        </Row>
      
      <div> 
        <ErrorModal message={errorMessage} />
        <RenderModal />
      </div>
   
    </Container> 
  )
}

export default TableBooking