import { useNavigate } from "react-router-dom";
// import { Button } from "./components/Button";
// import Storage from "./icons/Storage";
// import { Analyze } from "./icons/Analyze";
// import { Discuss } from "./icons/Discuss";
// import { Accessed } from "./icons/Accessed";
// import { Recieve } from "./icons/Recieve";
// import { Search } from "./icons/Searrch";
// import { Send } from "./icons/Send";   
import { NavBar } from "./New-components/NavBar";
import { FeatureCard } from "./New-components/FeatureCard";
import { Card } from "./New-components/Card";
import { ReviewCard } from "./New-components/ReviewCard"; 
import HorizontalScroll from "./New-components/HorizontalScroll";

export function Rouute() { 
  const navigate = useNavigate();
  const handleUserClick = () => { 
    navigate('/user/portal/signup');
  };

  // const handleDoctorClick = () => {
  //   navigate('/doctors/signup');
  // }; 
  return <div >
    {/* <div className="flex justify-center mt-16">   
<div className="flex flex-col justify-center w-full mr-4"> 
    <h1 className=" flex justify-center text-slate-700 font-semibold text-4xl "> I am a Patient</h1>
    <div id="reports-list" className="report-list p-4 mt-10 bg-slate bg-slate-300 rounded-lg shadow-2xl h-96 overflow-x-hidden overflow-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" > 
    <div className=" text-slate-800 font-medium text-left text-1xl"> 
    <div className="flex shadow-lg border bg-slate-200 p-1 rounded-t-lg">
      <div className="flex">
       <Storage />  
      </div> 
      <div className="ml-3">Store Your reports </div>
    </div>
    <div className="flex shadow-lg border bg-slate-200 p-1 rounded-t-lg mt-2">
      <div className="flex">
       <Analyze />  
      </div> 
      <div className="ml-3">  Analyse them </div>
    </div>
    <div className="flex shadow-lg border bg-slate-200 p-1 rounded-t-lg mt-2">
      <div className="flex">
       <Discuss />  
      </div> 
      <div className="ml-3"> Discuss Your reports without chatbot</div>
    </div>
    <div className="flex shadow-lg border bg-slate-200 p-1 rounded-t-lg mt-2">
      <div className="flex">
       <Accessed />  
      </div> 
      <div className=" ml-3 text-left "> Get Permanent logs of who accessed your profile and which report</div>
    </div>
    <div className="flex shadow-lg border bg-slate-200 p-1 rounded-t-lg mt-2">
      <div className="flex">
       <Recieve />  
      </div> 
      <div className="ml-3"> Recieve reports from Hospital/Doctor </div>
    </div> 
    </div>
       </div>
      <div className="flex justify-center  -mt-20">
        <Button label={'Join as a user'} height={12} loader={''} onclick={handleUserClick}></Button>
      </div>
</div> 
<div className="flex flex-col justify-center w-full ml-5 ">
    <h1 className="flex justify-center text-slate-700 text-4xl font-semibold "> I am a Doctor</h1>
    <div id="reports-list" className="mainpage p-4 mt-10  bg-slate-300 rounded-lg shadow-lg h-96 overflow-x-hidden overflow-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" > 
    <div className="text-slate-800 font-medium text-left text-1xl "> 
    <div className="flex shadow-lg border bg-slate-200 p-1 rounded-t-lg mt-2">
      <div className="flex">
       <Search />  
      </div> 
      <div className="ml-3"> Search Your Patient </div>
    </div>
    <div className="flex shadow-lg border bg-slate-200 p-1 rounded-t-lg mt-2">
      <div className="flex">
       <Analyze />  
      </div> 
      <div className="flex ml-3">
      Access patient data
      </div>
    </div> 
    <div className="flex shadow-lg border bg-slate-200 p-1 rounded-t-lg mt-2">
      <div className="flex">
       <Send />  
      </div> 
      <div className=" ml-3">Send them their reports</div>
    </div>
    <div className="flex shadow-lg border bg-slate-200 p-1 rounded-t-lg mt-2">
      <div className="flex">
       <Analyze />  
      </div> 
      <div className="flex ml-3">
       Analyze their Medical Records before Major tocatment 
      </div>
    </div> 
    <div className="flex shadow-lg border bg-slate-200 p-1 rounded-t-lg mt-2">
      <div className="flex">
       <Analyze />  
      </div> 
      <div className="flex ml-3">
       Manage your patient medical records 
      </div>
    </div> 
    </div> 
       </div>
      <div className="flex justify-center -mt-20">
        <Button label={'Join as a doctor'} height={12} loader={''} onclick={handleDoctorClick}></Button>
      </div> 
</div> 
      </div> */}
    <div id="NEW INTERFACE">
      <div className=" fixed w-full z-50 top-0 left-0 right-0">
        <NavBar />
      </div>
      <div className=" mt-24 ml-16 sm:md36 md:ml-96">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1175 263" fill="black" className="abs hero-backgroundImage top right primary-3"><path d="M470 96.1505C285.24 111.849 142.033 74.7745 0 0H1175V263C862.527 210.142 1128.96 40.1598 470 96.1505Z" fill="#831a4a"></path></svg>
      </div>
      <div id="MAIN_CONTENT" className="">
        <div id="TOP ELEMENT" className="element px-0 lg:px-24">
          <div className=" flex-none justify-center md:flex px-7 py-4">
            <div className="">
              <div className=" flex font-serif font-light text-4xl md:text-5xl lg:text-6xl max-w-lg lg:max-w-xl ">
              Caring Today for a Healthier Tomorrow
              </div>
              <div className=" mt-7 text-lg max-w-lg">
                Enhancing the ease of
                communication and scheduling between patients and doctors to provide a
                smoother experience.Your healthcare reports, all in one place
              </div>
              <div className=" mt-10">
                <button className="btn flex rounded-full px-24 py-4 text-md font-bold hover:bg-pink-500 transition-colors duration-700   text-black">see, it works</button>
                <button className=" bg-transparent border-2 hover:text-gray-500 border-gray-800 rounded-full mt-4 px-24 py-4 text-md font-bold   text-black">Learn about </button>
              </div>
            </div>
            <div className="  items-center mt-0 lg:-mt-36 md:-mt-12 ">
              <img src="https://cdn.sanity.io/images/8qqycr4y/production/1359876f340cab7ba723e7d2de83df051c094448-600x701.png?fm=webp" alt="" />
            </div>
          </div>
        </div>
        <div id="SECOND ELEMENT" className="element px-0 lg:px-24">
          <div className=" flex flex-col px-7 py-4 mt-10">
            <div className=" text-4xl md:text-5xl">
              Finally, healthcare that treats the whole you
            </div>
            <div>
              <div className=" mt-5 md:mt-12 flex py-10">
                <HorizontalScroll>
                <FeatureCard image="https://pub-f7df8bb286174a36bc558870137a7fb7.r2.dev/Secure%20Server-cuate.png" title="Secure Storage of Medical Records" content=" Our platform ensures that patients' medical records are securely stored and managed, providing a reliable repository for all essential health information." />
                <FeatureCard image="https://pub-f7df8bb286174a36bc558870137a7fb7.r2.dev/Authentication-rafiki.png" title="Access Control" content="Patients will have the ability to grant and revoke access to their medical records as needed, ensuring their privacy and control over their personal health data." />
                <FeatureCard image="https://pub-f7df8bb286174a36bc558870137a7fb7.r2.dev/Chat%20bot-pana.png" title="Internet-Connected Chat System" content=" Our chat system helps patients understand their medical reports and offers subtle suggestions based on verified online resources to aid in recovery. This feature is designed to support patients without diagnosing conditions, enhancing their engagement and understanding of their healthcare journey." />
                <FeatureCard image="https://pub-f7df8bb286174a36bc558870137a7fb7.r2.dev/Sandy_Tech-25_Single-04.jpg" title="Audit Log System" content="A detailed audit log will track who accessed medical records and when, ensuring transparency and accountability in the management of health information." />
                </HorizontalScroll>
              </div>
              <div className=" ml-4 text-7xl">
                . . .
              </div>
            </div>
          </div>
        </div>
        <div id="THIRD ELEMENT" className="diff-element">
          <div className=" flex flex-col py-4 mt-10">
            <div className="">
            <div className="sd">
              <svg className="block" viewBox="0 0 1280 72" fill="none"><path d="M1280 71L1280 4.70043C662 104.425 463.035 -25.6055 0 4.70034V71C0 71 146.362 72.4279 385.419 71C624.476 69.5721 803.659 71 990.381 71H1280Z" fill="#ecdccd"></path></svg>
            </div>
            <div className="third_element flex-none md:flex md:justify-center  py-10 px-10 lg:px-40">
              
              <div className=" ml-0 sm:ml-40 md:ml-0 max-w-lg">
                <img src="https://cdn.sanity.io/images/8qqycr4y/production/b00cf120c34a1d75d78d15579a54e0673b447d95-940x600.png?fm=webp" alt="" />
              </div>
              <div className=" ml-0 sm:ml-40 md:ml-0 -mt-20 md:-mt-0">
                <div className=" text-3xl md:text-4xl mt-20">
                  Digitally secure your reports and <div className=" font-mono text-pink-800">stay connected !</div> 
                </div>
                <div className=" text-lg mt-6">
                  Swasthlekh elevates care through connected Records
                </div>
                <div>
                  <button onClick={()=>{navigate('/user/portal/signup')}} className=" bg-transparent border-2 hover:text-gray-500 border-gray-800 rounded-full mt-4 px-10 py-4 text-md font-bold   text-black">Start Now! </button>
                </div>

              </div>
            </div>
            <div className="s">
              <svg className="block" viewBox="0 0 1280 72" fill="none"><path d="M1280 71L1280 4.70043C662 104.425 463.035 -25.6055 0 4.70034V71C0 71 146.362 72.4279 385.419 71C624.476 69.5721 803.659 71 990.381 71H1280Z" fill="#ecdccd"></path></svg>
            </div>
            </div>
          </div>
        </div>
        <div id="FOURTH ELEMENT" className="element px-0 lg:px-24">
          <div className=" flex flex-col px-7 py-4 mt-10">
            <div className=" text-4xl md:text-5xl">
              At Swasthlekh, we do things differently
            </div> 
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center">
            <Card image="https://cdn.sanity.io/images/8qqycr4y/production/1255da34b1384a03bda60fb493eefb5018db5941-600x600.png?fm=webp" title="Tailored to the whole you" content=" Our platform is designed with the patient in mind, ensuring a user-friendly interface that makes it easy for patients to manage and access their medical records. Patients can securely store, share, and revoke access to their health information as needed."/>
            <Card image="https://cdn.sanity.io/images/8qqycr4y/production/d19a5f3d175233253efd723e3683d6070bd313d4-600x600.png?fm=webp" title="Virtual and in-person" content=" The application supports both virtual and in-person interactions, providing flexibility for healthcare providers and patients. Whether accessing records during a telehealth consultation or in a hospital setting, the platform ensures seamless integration and accessibility."/>
            <Card image="https://cdn.sanity.io/images/8qqycr4y/production/869477818cd154cc0d579b406361986d4fd1b0c7-600x600.png?fm=webp" title="Accessible and affordable" content=" Ensuring that the platform is accessible to all users is a top priority. Our application includes features such as multilingual support, compatibility with various devices, and user-friendly navigation to cater to a diverse patient population."/>
            </div>
          </div>
        </div>
        <div id="FIFTH ELEMENT" className="diff-element ">
          <div className=" flex flex-col py-4 mt-10">
            <div className=" ">
            <div className="sd">
            <svg className="block" viewBox="0 0 1280 30" fill="none"><path d="M0 13.8806V30L640 30L1280 30V0C1280 0 1084.58 13.8806 914.643 13.8806C744.709 13.8806 533.792 0 363.858 0C193.924 0 0 13.8806 0 13.8806Z" fill="#ecdccd"></path></svg>
            </div>
            <div className="third_element flex flex-col px-6 lg:px-32 py-10">
            <div className=" text-4xl md:text-5xl">
            Healthcare that hears you
            </div>
            <div className=" -z-1 py-11">
              <div className="scroll mt-2 flex ">
                <HorizontalScroll>
                <ReviewCard name="Sarah" review="Swasthlekh is amazing in every way and I feel the the care I receive is superior to all other health services I've experienced. The emphasis on full body health and women is unmatched and I tell everyone I know about Swasthlekh!" />
                <ReviewCard name="john" review="Swasthlekh is amazing in every way and I feel the the care I receive is superior to all other health services I've experienced. The emphasis on full body health and women is unmatched and I tell everyone I know about Swasthlekh!" />
                <ReviewCard name="Jessi" review="Swasthlekh is amazing in every way and I feel the the care I receive is superior to all other health services I've experienced. The emphasis on full body health and women is unmatched and I tell everyone I know about Swasthlekh!" />
                <ReviewCard name="Mukesh" review="Swasthlekh is amazing in every way and I feel the the care I receive is superior to all other health services I've experienced. The emphasis on full body health and women is unmatched and I tell everyone I know about Swasthlekh!" />
                </HorizontalScroll>
              </div>
              <div className=" ml-4 text-7xl">
                . . .
              </div>
            </div>
          </div>
            <div className="s z-20">
              <svg className="block" viewBox="0 0 1280 72" fill="none"><path d="M1280 71L1280 4.70043C662 104.425 463.035 -25.6055 0 4.70034V71C0 71 146.362 72.4279 385.419 71C624.476 69.5721 803.659 71 990.381 71H1280Z" fill="#ecdccd"></path></svg>
            </div>
            </div>
          </div>
        </div>
        {/* <div id="SIXTH ELEMENT" className="element px-0 lg:px-24">
          <div className=" flex flex-col px-7 py-4 mt-10">
            <div className=" text-4xl md:text-5xl">
            Our Collaborative Care model
            </div>  
            <div className=" mt-8 max-w-screen">
            We believe in collaborative, relationship-based care where everyone is in-sync. Rather than one doctor, you get an integrated Care Team that works together to manage your health.
            </div>
            <div>
            <button className=" bg-transparent border-2 hover:text-gray-500 border-gray-800 rounded-full mt-4 p-10 md:px-24 py-4 text-md font-bold   text-black">Learn more about this</button>
            </div>
            <div className=" mt-10">
              <img src="https://cdn.sanity.io/images/8qqycr4y/production/281fb4b8f15ac0d8aab0e54cfa991205d7e33367-4800x2968.png?w=2400&h=1484&fit=crop&fm=webp" alt="" />
            </div>
          </div>
        </div>  */}
        <div id="EIGHTH ELEMENT">
        <div className=" flex flex-col lg:-mt-32 lg:scroll-mt-12 -mt-12 md:-mt-12">
            <div className=" ">
            <div className="sd">
            <svg className="block" viewBox="0 0 1280 30" fill="none"><path d="M0 13.8806V30L640 30L1280 30V0C1280 0 1084.58 13.8806 914.643 13.8806C744.709 13.8806 533.792 0 363.858 0C193.924 0 0 13.8806 0 13.8806Z" fill="#28d2725"></path></svg>
            </div>
            <div className=" flex justify-center bg-stone-800">
            <div className="third_element bg-stone-800 mt-20 flex flex-col px-10 lg:px-48 py-10"> 
             <div className=" flex-none md:flex rounded-lg text-white mt-14 border-2 border-white">
              <div className=" flex"> 
                <img className=" w-full lg:max-w-lg rounded-lg" src="https://cdn.sanity.io/images/8qqycr4y/production/d1208f3b0b7fd73eb563c90fc0c0212f38b1e091-1220x814.png?fm=webp" alt="" /> 
                <div className=" -ml-9 hidden md:flex">
                <svg className="block y" width="46" height="328" viewBox="0 23 38 315" fill="none"><path d="M6.13073 0.000121695L36.883 -9.15616e-05C36.883 161.888 37.6251 260.044 37.625 407.5L5.43432 407.5C5.43432 407.5 46.3498 370.01 21.7573 283.198C-2.83533 196.385 -8.92437 186.936 15.7355 106.619C40.3954 26.3029 6.13073 0.000121695 6.13073 0.000121695Z" fill="#282725"></path></svg>
                </div>
              </div>
              <div className=" p-10">
                <div className=" text-3xl max-w-xs font-serif">
                  Get care from doctors you can trust
                </div>
                <div className=" max-w-md mt-8">
                From our OB/GYNs to Nurse Practitioners to Acupuncturists to Therapists, we hire the highest quality providers to collaborate on your care.
                </div>
                <div >
                <button className=" bg-transparent border-2 hover:text-gray-500 border-white rounded-full mt-4 px-5 md:px-10 py-4 text-sm md:text-md font-bold">Meet Your Care Team </button>
                </div>
              </div>
             </div>
          </div> 
            </div>
            </div>
          </div>
        </div>
        <div className=" bg-stone-800">
          <div className=" line"> 
           <br />
          </div>
        </div>
        <div id="NINTH ELEMENT" className=" bg-stone-800 text-white py-28 pt-28">
          <div className=" flex justify-between px-8 md:px-32 py-4">
            <div className=" ">
              <div className=" flex text-4xl md:text-4xl lg:text-5xl max-w-lg lg:max-w-2xl">
              Connected care, reimagined & tailored to you
              </div>
              
              <div className="flex mt-20">
                <div className=" ">
                <button onClick={handleUserClick} className="btn flex rounded-full px-4 md:px-10 py-4 text-xs sm:text-sm md:text-md font-bold hover:bg-pink-500 transition-colors duration-700  text-black">Join now</button>
                </div>
                <div className=" mx-4 md:mx-6">
                <button className=" bg-transparent rounded-full border-2 hover:text-gray-500 border-whiterounded-full px-5 sm:px-7 md:px-10 py-4 text-xs sm:text-sm md:text-md font-medium md:font-bold">Learn about membership</button>
                </div>
              </div>
            </div> 
          </div>
        </div>
        <div id="LAST ELEMENT" className="last-element text-white pt-12">
          <div className=" flex-none md:flex justify-between px-5 md:px-24 md:py-4">
            <div className=" font-mono ">
               <div className="last">
                COMPANY
               </div>
               <div className="last">
                TEAM
               </div>
               <div className="last">
                DEI
               </div>
               <div className="last">
                HEALTH SYSTEMS
               </div>
               <div className="last ">
                CONTACT
               </div>
            </div> 
            <div className="flex py-20 md:py-0"> 
            <a href="https://twitter.com/" rel="noopener nofollow" target="_blank" className=" mr-5">
              <img className="" width="20" height="20" src="https://cdn.sanity.io/images/8qqycr4y/production/cd2781d5887784500708f6e7c2311b6b35c8498d-20x20.png" alt="bf2214f89b06f61ada48feba4599b93b747cbd86-57x47.png"/> 
              </a>
              <a href="https://www.instagram.com" rel="noopener nofollow" target="_blank" >
                <img width="20" height="20" src="https://cdn.sanity.io/images/8qqycr4y/production/3c491e55ecd18d626c56b3768ea0057d36caf09d-20x20.png" alt="8b0c50296c2ddf007f7dbd0d7e4158d3ffc060b9-57x57.png"/>
                </a>
            </div>
          </div>
          <div className=" px-5 md:px-24 py-0 md:py-10 pb-0">
            <div className=" border-t-2 flex justify-between pt-10 pb-12 md:pb-0">
              <div className="bottom md:grid grid-cols-4">
              <div className="bottom">
                Website Terms 
              </div>
              <div className="bottom md:ml-7">
                Privacy
              </div>
              <div className=" bottom">
                Policy
              </div>
              <div className=" bottom">
                Credits
              </div>
              </div>
              <div className="bottom pt-4">
              © Swasthlekh 2024
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> 

  </div>
}