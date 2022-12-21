import React, {useState, useEffect, Fragment, useRef} from 'react'
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faCalendarXmark, faClipboard } from '@fortawesome/free-regular-svg-icons'
import { GiPartyPopper } from "react-icons/gi";
import 'animate.css'
import { 
    Row, Col, Container, CardFooter  
   } from 'reactstrap'
import {Star, RefreshCcw} from 'react-feather';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardImg, CardBody, CardText , CardHeader, Badge} from 'reactstrap';
import Loading from './Loading';

const View = () => {
  const location = useLocation()
 // const {reservationId, bookingType} = location.state
  const [locationState] = useState(location.state ? location.state : '')
  const [paramsData] = useState(sessionStorage.getItem('paramData') ? JSON.parse(sessionStorage.getItem('paramData')) : '') 
  const [tokenData, setTokenData] = useState(sessionStorage.getItem('tokenData') ? JSON.parse(sessionStorage.getItem('tokenData')) :'')
  const [bookingStatusDetails, setBookingStatusDetails] = useState('')
  const [walkingStatusDetails, setWalkingStatusDetails] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [bookingStatusColor, setBookingStatusColor] = useState('#316cf4')
  const [organizationId, setOrganizationId] = useState(locationState && locationState.OrganizationId)
  const [propertyId, setPropertyId] = useState(locationState && locationState.PropertyId)
  const [bookingId, setBookingId] = useState(locationState && locationState.BookingId)
  const [outletCode, setOutletCode] = useState(locationState && locationState.OutletCode)
  
  const bookingRef = useRef(true)
  const walkingRef = useRef(true)
  const tokenRef = useRef(true)

  const GetGuestAppTokenHandler = () => {
     //https://dev.lucidits.com/LUCIDPOSIntegrationAPI/V1/GetGuestAppToken
    //?OrganizationId=<<OrganizationId>>&PropertyId=<<PropertyId>>&TokenKey=<<TokenKey>>
     if ((paramsData || propertyId) && tokenRef.current) { 
     console.log(propertyId, paramsData, tokenData)
      !tokenData && axios.get(`${process.env.REACT_APP_BASE_API_URL}LUCIDPOSIntegrationAPI/V1/GetGuestAppToken`,
      {
      params:{
        OrganizationId:paramsData.organizationId || organizationId,
        PropertyId : (paramsData.propertyId !== 'NONE' && paramsData.propertyId) || propertyId,
        TokenKey :"A519618A-7218-4375-AC2B-34811ED6AD37"
      },
     // headers: { Authorization: `Bearer ${userData.lucidapiToken}`},
     "Content-Type": "application/json"
    } 
   ).then((response) => { 
    setTokenData(response.data.response)
    //console.log(tokenData)
  }).catch(error => console.log(error)) 
  }
  }
   useEffect(() => {
     
       !tokenData && GetGuestAppTokenHandler() 
       
    }, [paramsData])

    useEffect(() => {
         if (!tokenData || tokenData === "") { 
          tokenRef.current = true 
        } 
    }, [tokenData])
   
  useEffect(() => {
      if (locationState && !paramsData.remarks) {
        sessionStorage.setItem('linkState', JSON.stringify(locationState))
       // console.log(locationState, organizationId, propertyId)
      }
  }, [locationState, paramsData])

  useEffect(() => {
        if (sessionStorage.getItem('linkState')) {  
          const state = JSON.parse(sessionStorage.getItem('linkState')) 
          setOrganizationId(state.OrganizationId)
          setPropertyId(state.PropertyId)
          setBookingId(state.BookingId)
          setOutletCode(state.OutletCode) 
        }
  }, [sessionStorage.getItem('linkState')])

  const getOutletListHandler = () => {
    //curl --location --request GET 'https://dev.lucidits.com/LUCIDPOSGuestTableReservationAPI/V1/GetOutletList?PropertyId=10000000011000000001'
   axios.get(`${process.env.REACT_APP_LUCIDPOS_GUEST_TABLE}GetOutletList`, {
    params:{
      PropertyId:paramsData.propertyId
    },
    headers: { Authorization: `Bearer ${tokenData.token}`},
     "Content-Type": "application/json"
    }
   ).then((response) => { 
    //setTokenData(response.data.response)
   // console.log(response.data.response)
    const outleListData = response.data.response
   // if (outleListData.outletList.length === 1)  {
   //   setModalOutlet(false)
   //   setImageUrl(outleListData.outletList.map(item => item.imageUrl)[0])
   //   setOutletName(outleListData.outletList.map(item => item.outletName)[0])
   //   setOutletCode(outleListData.outletList.map(item => item.outletCode)[0])
   //  //console.log(outleListData.outletList.map(item => item.outletName)[0], outleListData.outletList.map(item => item.outletCode)[0])
   // }
   
    //console.log(outleListData)
 
  }).catch(error => console.log(error))
   }

  const bookingStatusHandler = () => {
    //  GET 'https://dev.lucidits.com/LUCIDPOSGuestTableReservationAPI/V1/
    //GetBookingStatusDetails?PropertyId=10000000131000000002&OutletCode=HAMR&ReservationId=d6140b0bf91244f9b58e01e76bbda440'
   //  console.log(bookingRef.current)
    if (bookingRef.current) axios.get(`${process.env.REACT_APP_LUCIDPOS_GUEST_TABLE}GetBookingStatusDetails`, { 
      params:{
        PropertyId: (paramsData.propertyId !== 'NONE' && paramsData.propertyId) || propertyId,   
        OutletCode: (paramsData.outletCode !== 'NONE' && paramsData.outletCode) || outletCode,
        ReservationId:paramsData.remarks ? paramsData.remarks.split('|')[1] : bookingId
      },
      headers: { Authorization: `Bearer ${tokenData.token}`},  // get from session storage from TableBooking outletList
       "Content-Type": "application/json"
      }
   ).then((res) =>{
    bookingRef.current = false
    // console.log(res.data.response)
     if (res.data.errorCode === 0) { 
      
       //console.log(bookingRef.current)
       setBookingStatusDetails(res.data.response) 
       }
   })
  // bookingRef.current = false // to stop calling api 2 times
   }
   const walkingBookingStatusHandler = () => {
     //curl --location --request GET 'https://dev.lucidits.com/LUCIDPOSGuestTableReservationAPI/V1/GetWalkInStatusDetails?
     //PropertyId=10000000131000000002&OutletCode=HAMR&CheckInId=d6140b0bf91244f9b58e01e76bbda440'
    axios.get(`${process.env.REACT_APP_LUCIDPOS_GUEST_TABLE}GetWalkInStatusDetails`, {
      params:{
        PropertyId: paramsData.propertyId,   
        OutletCode:paramsData.outletCode,
        CheckInId:paramsData.remarks.split('|')[1]
      },
      headers: { Authorization: `Bearer ${tokenData.token}`},  // get from session storage from TableBooking outletList
       "Content-Type": "application/json"
      }
   ).then((res) =>{
    walkingRef.current = false
    //console.log(res.data.response)
     //const data =  res.data.response
   // console.log( res.data.response)
     if (res.data.errorCode === 0) setWalkingStatusDetails(res.data.response)
    
   })
    
   }
    
   useEffect(() => {   
    const booking = paramsData.remarks && paramsData.remarks.split('|')[0] === '1'
    const walking = paramsData.remarks && paramsData.remarks.split('|')[0] === '2'
       if ((paramsData.remarks && paramsData.remarks.split('|')[0] === '1')  && (!bookingStatusDetails && tokenData.token)) {  
       
        bookingRef.current && bookingStatusHandler() 
          // console.log( bookingRef.current)
         } else if (paramsData.remarks && paramsData.remarks.split('|')[0] === '2' && tokenData)
        { 
           walkingBookingStatusHandler() 
        } else if (bookingId && (!booking && !walking)) { 
        
          bookingRef.current && bookingStatusHandler() 
         
          
         } 
       //  console.log(paramsData.remarks.split('|')[0], paramsData, tokenData)
       console.log( bookingRef.current)
   }, [paramsData, tokenData, bookingId])
  
   useEffect(() => {
      if (bookingStatusDetails) {
          bookingRef.current = false
        setImageUrl(bookingStatusDetails.bookingDetails.outletImageUrl)
        setBookingStatusColor(() => {
          if (bookingStatusDetails.bookingDetails.currentStatus === 'Cancelled') return 'black'
          if (bookingStatusDetails.bookingDetails.currentStatus === 'Confirmed') return 'black'
          if (bookingStatusDetails.bookingDetails.currentStatus === "Checked-In") return 'black'
          if (bookingStatusDetails.bookingDetails.currentStatus === 'Waiting List') return 'black'
        })
       } 
   }, [bookingStatusDetails])
  
  const BookingComponent = () => { 
    return ( 
      <Card style={{ backgroundColor: 'white', borderColor: 'white' }} className='bx'> 
       <CardHeader className='text-white fixed-top mb-5' style={{border:'none', background:'#EAEAEA'}}>
        { imageUrl ? <div className="d-flex justify-content-center m-0" style={{backgroundColor: '#EAEAEA', borderColor: '#333' , borderRadius:'7px 7px 0px 0px'}}>
        <CardImg variant="top" src={imageUrl} style={{maxHeight:'70px', maxWidth:'200px', borderRadius:'10px'}}/>   
        </div> : <div className="d-flex justify-content-center m-0">
        <div className="m-0 pt-1 px-2" style={{textAlign:'center', background:'white', borderRadius:'5px', boxShadow:'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px'}}>
        <h5 className="m-0"  style={{color:'grey'}}>{bookingStatusDetails && bookingStatusDetails.bookingDetails.outletName} </h5>  
        <h6   style={{color:'grey'}} className='mb-2 '>{bookingStatusDetails && bookingStatusDetails.bookingDetails.propertyName}</h6>
        </div>
        </div>
        }
       </CardHeader> 
        <CardBody className='mt-5 pt-5'>
        <div className="d-flex justify-content-center m-0 mt-5 mb-1"> 
           <h4>Thank you {bookingStatusDetails && bookingStatusDetails.bookingDetails.guestName}</h4>
          </div>
          <CardText className='mt-1'> 
          <div className="d-flex justify-content-center m-0 mb-4"> 
       Your reservation has been {bookingStatusDetails && bookingStatusDetails.bookingDetails.currentStatus.toLowerCase()} 
      </div>
          <div className="d-flex justify-content-center m-0 mt-5"> 
         {bookingStatusDetails.bookingDetails.currentStatus === 'Cancelled' && <FontAwesomeIcon icon={faCalendarXmark} className="fa-solid fa-triangle-exclamation fa-fade" style={{fontSize:'70px'}}  /> }
         { bookingStatusDetails.bookingDetails.currentStatus === 'Confirmed' && <div className='animate__animated animate__shakeY' ><GiPartyPopper style={{fontSize:'70px'}}/></div>}
         { bookingStatusDetails.bookingDetails.currentStatus === 'Checked-In' && <div className='animate__animated animate__shakeY' ><GiPartyPopper style={{fontSize:'70px'}}/></div>} 
         { bookingStatusDetails.bookingDetails.currentStatus === 'Waiting List' && <FontAwesomeIcon icon={faClipboard} className="fa-solid fa-triangle-exclamation fa-fade" style={{fontSize:'70px'}}/>} 
        </div> 
        <div className="d-flex justify-content-center m-0 mt-4 pb-0">
          <h2 style={{fontWeight:'900', marginBottom:'0px'}}> {bookingStatusDetails && bookingStatusDetails.bookingDetails.bookingId}
          </h2> 
        </div> 
        <div className="d-flex justify-content-center m-0 p-0">
      <small>Reservation Number</small> 
        </div>
        <div className="d-flex justify-content-center m-0 mt-5">
          </div>
        <div className="d-flex justify-content-center mt-5">
             <small>Your reservation details</small>
        </div>
      <div className="d-flex justify-content-center " style={{ borderTop: "1px solid black"}}>
          <div style={{width:'100px  ', borderRight: "1px solid black", marginTop:'5px', padding:'10px', textAlign:'center',  fontSize:'12px'}}
           className="px-3"
          >
            <small>
              {bookingStatusDetails && bookingStatusDetails.bookingDetails.reservationDate}
              <div>Date</div>
              </small> 
              </div> 
          <div style={{width:'100px' , borderRight: "1px solid black", marginTop:'5px', padding:'10px', textAlign:'center',  fontSize:'12px'}}
          className="px-3"
          >
            <small>
             {bookingStatusDetails && bookingStatusDetails.bookingDetails.reservationTime} 
             <div>Time</div>
             </small></div>
          <div style={{width:'100px ', marginTop:'5px', padding:'10px', textAlign:'center', fontSize:'12px'}}
           className="px-3" 
          >
            {bookingStatusDetails &&  <small> 
              {bookingStatusDetails.bookingDetails.noOfGuest} People
            <div style={{paddingRight:'5px'}}>Guests</div>
              </small>}</div> 
          </div>  
          <div className="d-flex justify-content-center m-0 mt-5">
        <h4><Badge outline color={"black" || bookingStatusColor}>{bookingStatusDetails && bookingStatusDetails.bookingDetails.currentStatus}</Badge> </h4> 
      </div> 
      <div className="d-flex justify-content-center m-0 mt-0">
      <small style={{fontSize:'10px'}}>
         {([(bookingStatusDetails && bookingStatusDetails.bookingDetails.currentStatus === 'Cancelled') && bookingStatusDetails.bookingDetails.cancelReason]) }
         {((bookingStatusDetails && bookingStatusDetails.bookingDetails.currentStatus === 'Waiting List') && ['Restaurant will update your booking status soon'])
          }
          </small>
        </div>      
          <div className="d-flex justify-content-center m-0">
         {bookingStatusDetails && bookingStatusDetails.bookingDetails.showRefresh && <Link to = ""  onClick = {bookingStatusHandler} style={{textDecoration:'none', color:'black', paddingLeft:'7px'}}> 
           <RefreshCcw size={15} strokeWidth='3px'/></Link> }
          </div>  
          <div className="d-flex justify-content-center m-0"> 
          </div>  
          <div className="d-flex justify-content-center m-0 mt-4">
          <small style={{fontSize:'10px'}} className='mb-0'><span style={{paddingRight:'5px'}}>Booked On:</span>{bookingStatusDetails && bookingStatusDetails.bookingDetails.bookedOn} </small>
          </div>  
        
          <div className="d-flex justify-content-center m-0">
          <small style={{fontSize:'10px'}}><span style={{paddingRight:'5px'}}>Booking Source:</span> {bookingStatusDetails && bookingStatusDetails.bookingDetails.bookingSource}</small>
          </div> 
          <div className="d-flex justify-content-center m-0 mt-4">{
            bookingStatusDetails && bookingStatusDetails.bookingDetails.showTableBookingLink &&
          <p style={{marginBottom:'0px'}}>
            <small><Link to='/table-booking' state ={{LinkClick:true}} >Go To Table Booking</Link> 
            </small></p>}
          </div> 
          </CardText>
          <Row className="d-flex justify-content-center border-top fixed-bottom" 
          style={{background:'#EAEAEA'}}>
           <div style={{width:'160px'}}>
              <small><em style={{fontSize:'11px', color:'#8D8D8D'}}>Powered by {' '} </em><Link to= "" 
              onClick={() => window.open('https://lucidpos.com/', '_blank')}
              style={{fontWeight:'normal', fontSize:'11px', color:'#8D8D8D'}}>
              <strong>LUCID POS</strong></Link></small> 
            </div>
        </Row> 
        </CardBody>
        </Card> 
   )
  }

  const Wlcontent = () => {
    return (
      <Fragment>  
      <div className="d-flex justify-content-center mt-5"  style={{marginBottom:'0px', color:'black'}}>   
      <h2 style={{fontWeight:'900'}}>
         {walkingStatusDetails && walkingStatusDetails.walkInDetails.currentWaitlistNo}
         </h2> 
      </div>
      <div className="d-flex justify-content-center m-0 ">
        <span style={{marginBottom:'0px', color:'black'}}>
        <small> Your Current Wait List Number </small> 
        <Link to = ""  onClick = {walkingBookingStatusHandler} style={{textDecoration:'none', color:'black', paddingLeft:'7px'}}> 
           {walkingStatusDetails && walkingStatusDetails.walkInDetails.showRefresh && <RefreshCcw size={15} strokeWidth='3px'/>}
         </Link> 
       </span> 
      </div>  
      <div className="d-flex justify-content-center m-0 mt-5"> 
        
       </div> 
    
      </Fragment>
    )
  }

  const Confirmcontent = () => {
    return (
      <Fragment> 
      <div className="d-flex justify-content-center m-0 mt-5"> 
      <h2 style={{fontWeight:'900'}}>  {
        (walkingStatusDetails && walkingStatusDetails.walkInDetails.tableNos) || 78
        }
        </h2> 
      </div>
      <div className="d-flex justify-content-center m-0">
       <small>Table Number</small>
      </div>   
      
      <div className="d-flex justify-content-center m-0 mt-5"> 
        {
            walkingStatusDetails && walkingStatusDetails.walkInDetails.showOrderNow &&
          <p style={{marginBottom:'0px'}}>
            <small><Link to='' onClick = {() => window.open(walkingStatusDetails.walkInDetails.orderNowLink, '_self')}>{walkingStatusDetails.walkInDetails.orderNowDisplayName}</Link> 
            </small></p>}
       </div> 
      </Fragment>
    )
  }

  const CancelContent = () => {
    return (
      <Fragment>
      
        <div className="d-flex justify-content-center m-0 mt-5">
        <h4><Badge outline color='black'  >Cancelled</Badge> </h4> 
        </div> 
      <div className="d-flex justify-content-center m-0 mt-0 mb-5 pb-2">
      <small style={{fontSize:'10px'}}>[{walkingStatusDetails && walkingStatusDetails.walkInDetails.cancelReason}]</small>  
      </div>     
      <div className="d-flex justify-content-center m-0 mt-5"> 
        { // for spacing prupose , not rquired for cancelled to order
            //  walkingStatusDetails && walkingStatusDetails.walkInDetails.showOrderNow &&
            //<p style={{marginBottom:'0px'}}>
           // <small><Link to='' onClick = {() => window.open(walkingStatusDetails.walkInDetails.orderNowLink, '_self')}>{walkingStatusDetails.walkInDetails.orderNowDisplayName}</Link> 
           // </small></p>
            }
       </div> 
      </Fragment>
    )
  }

  const WalkingStatusComponent = () => {
    return (
      <Card style={{backgroundColor: 'white', height:'100vh'}} className='bx'> 
        <CardHeader className='text-white fixed-top mb-5' style={{border:'none', background:'#EAEAEA'}}>
          { 
           walkingStatusDetails.walkInDetails.outletImageUrl ?  <div className="d-flex justify-content-center m-0" style={{backgroundColor: '#EAEAEA', borderColor: '#333' , borderRadius:'7px 7px 0px 0px'}}>
           <CardImg variant="top" src={walkingStatusDetails.walkInDetails.outletImageUrl} style={{maxWidth:'200px', maxHeight:'70px', borderRadius:'10px'}}/>   
         </div> : <div className="d-flex justify-content-center m-0 ">
                  <div className="m-0 pt-1 px-2" style={{textAlign:'center', background:'white', borderRadius:'5px', boxShadow:'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px'}}>
                    <h5 className="m-0"  style={{color:'grey'}}>{walkingStatusDetails && walkingStatusDetails.walkInDetails.outletName}  </h5>  
                   <h6  style={{color:'grey'}} className='mb-2 '>{walkingStatusDetails && walkingStatusDetails.walkInDetails.propertyName}</h6>
                 </div>     
            </div> 
          } 
      </CardHeader>
        <CardBody className="mt-5 pt-5" >
        <div className="d-flex justify-content-center m-0 mt-5 mb-1">
    <h4 style={{marginBottom:'0px'}}>Thank you {walkingStatusDetails && walkingStatusDetails.walkInDetails.guestName} </h4> 
      </div>  

      <div className="d-flex justify-content-center m-0 mb-4"> 
      {  (walkingStatusDetails.walkInDetails.currentStatus === 2 ||  walkingStatusDetails.walkInDetails.currentStatus === 3) && 'Your table has been confirmed'}
      { (walkingStatusDetails.walkInDetails.currentStatus === 1 && 'Thanks for waiting, you will get your table soon')
      }
      { (walkingStatusDetails.walkInDetails.currentStatus === 4 && 'Your table has been cancelled')} 
      </div>
      <div className="d-flex justify-content-center m-0 mb-2"> 
      {  (walkingStatusDetails.walkInDetails.currentStatus === 2 ||  walkingStatusDetails.walkInDetails.currentStatus === 3) && <div className='animate__animated animate__shakeY' ><GiPartyPopper style={{fontSize:'70px', color:'black'}}/></div>}
       {    
        walkingStatusDetails.walkInDetails.currentStatus === 4 && <FontAwesomeIcon icon={faCalendarXmark} className="fa-solid fa-triangle-exclamation fa-fade" style={{color:'black', fontSize:'70px'}}/>
       }
       {
        walkingStatusDetails.walkInDetails.currentStatus === 1 && <FontAwesomeIcon icon={faClipboard} className="fa-solid fa-triangle-exclamation fa-fade" style={{color:'black', fontSize:'70px'}}/>
       }
      </div>
          <CardText className="mt-1"> 
          {
          walkingStatusDetails.walkInDetails.currentStatus === 1 && <Wlcontent />
          }  
           {
          (walkingStatusDetails.walkInDetails.currentStatus === 2 ||  walkingStatusDetails.walkInDetails.currentStatus === 3) && <Confirmcontent />
          }  
           {
          walkingStatusDetails.walkInDetails.currentStatus === 4 && <CancelContent />
          } 
             <div  className="d-flex justify-content-center mt-5"><small>Your walkin details</small></div>
               <div className="d-flex justify-content-center " style={{ borderTop: "1px solid black"}}>
          <div style={{width:'100px', borderRight: "1px solid black", marginTop:'5px', padding:'10px', textAlign:'center',  fontSize:'12px'}}
           className="px-3"
          >
            <small>
              {walkingStatusDetails && walkingStatusDetails.walkInDetails.checkInDate}
              <div>Date</div>
              </small> 
              </div> 
          <div style={{width:'100px', borderRight: "1px solid black", marginTop:'5px', padding:'10px', textAlign:'center',  fontSize:'12px'}}
          className="px-3"
          >
          <small>
             {walkingStatusDetails && walkingStatusDetails.walkInDetails.checkInTime} 
             <div>Time</div>
             </small></div>
          <div style={{width:'100px', marginTop:'5px', padding:'10px', textAlign:'center', fontSize:'12px'}}
           className="px-3" 
          >
            {walkingStatusDetails &&  <small> 
              {walkingStatusDetails.walkInDetails.noOfGuest} People
            <div style={{paddingRight:'5px'}}>Guests</div>
              </small>}</div> 
          </div> 
          </CardText>
            <Row className="d-flex justify-content-center border-top fixed-bottom" 
           style={{background:'#EAEAEA'}}>
           <div style={{width:'150px'}}>
              <small><em style={{fontSize:'11px', color:'#8D8D8D'}}>Powered by {' '}</em><Link to= "" 
              onClick={() => window.open('https://lucidpos.com/', '_blank')}
              style={{fontWeight:'normal', fontSize:'11px', color:'#8D8D8D'}}><strong>LUCID POS</strong></Link></small> 
            </div>
        </Row>
         </CardBody>
         </Card> 
        )
       }

    return ( 
        <Container fluid> 
            <Row >
         <Col> 
          {
          !bookingStatusDetails && !walkingStatusDetails && <Loading />
        }
          {bookingStatusDetails && <BookingComponent /> 
          }  
          {walkingStatusDetails && <WalkingStatusComponent />} 
         </Col>
       </Row> 
       </Container> 
    )
}

export default View