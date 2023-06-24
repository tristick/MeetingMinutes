import * as React from 'react';
import "@pnp/sp/folders";
import styles from './MeetingMinutesForm.module.scss';
import { IMeetingMinutesFormProps } from './IMeetingMinutesFormProps';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import * as formconst from "../../constant";
import * as ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import { IMeetingMinutesFormState } from './IMeetingMinutesFormState';
import { IStyleFunctionOrObject, ITextFieldStyleProps, ITextFieldStyles, Label, MessageBar, MessageBarType, PrimaryButton, Stack, TextField } from 'office-ui-fabric-react';
import { DateConvention, DateTimePicker, ListItemPicker } from '@pnp/spfx-controls-react';
import { getCustomerItem, getCustomerRef, getcontactlistId, submitDataAndGetId, updateData, uploadAttachment } from '../../../services/formservices';
import ReactDOM from 'react-dom';
import { isEmpty } from '@microsoft/sp-lodash-subset';
//import { SPFI} from '@pnp/sp';
//import { getSP } from '../../../pnpjsconfig';
import "@pnp/sp/files";



const textFieldStyles: Partial<ITextFieldStyles> = {
  field: {
    width: '600px', // Adjust the desired width
  },
};

let isemailInvalid:boolean = false;
let streamerror:boolean =false;
let isbuttondisbled : boolean = false;
let buttontext : string = "Submit";
let isselectedattendees:boolean = false ;
let listId: number;
let customerreference:string;
let isCustomerWorkspace:string;
let cweburl:any;
let contactlist :string;


export default class MeetingMinutesForm extends React.Component<IMeetingMinutesFormProps, IMeetingMinutesFormState> {
  private pmdt: DataTransfer; 
  private msdt: DataTransfer; 
  private mmdt: DataTransfer; 


  filesNamesRef: React.RefObject<HTMLSpanElement>;

  constructor(props: IMeetingMinutesFormProps, state: IMeetingMinutesFormState) {  
    super(props); 
    this.pmdt = new DataTransfer();
    this.msdt = new DataTransfer();
    this.mmdt = new DataTransfer();
    this.filesNamesRef = React.createRef(); 
    this.state = {  
      title: "",
      purposeofmeeting:"",
      managementsummary:"",
      mainminutes:"",
      actions:"",
      customer:"",
      meetingdate:new Date(),
      users:[],
      attendeeDropdown:"",

      attendeesother:"",
      interestedPartiesexternal: [],
      interestedPartiesexternalstr:"",
      allfieldsvalid:true,
      isSuccess: false,
      meetingtitle:"",
      location:"",
      pmdocuments:"",
      msdocuments:"",
      mmdocuments:"",
      weburl:"",
      contactlistid:""

    }
  
  }

  public componentDidMount()
  {
   
    this.fetchCustomer();
    
    
  }


  fetchCustomer = async () => {
    
      const customerItem:any = await getCustomerItem(this.props);
      console.log("customer",customerItem)
      if(customerItem =="null")
      {
        console.log("no block")
          isCustomerWorkspace = "No"
      }else{
        console.log("yes block")
      try {
        isCustomerWorkspace = "Yes"
        const customer = customerItem[0].Title
       
        const customerRef = customerItem[0].RefCode;

      this.setState({customer:customer});
      customerreference = customerRef

   
    } catch (error) {
      console.error('Error fetching customer items:', error);
    }
  }
  };

  private _oncustomerSelectedItem = async (data: { key: string; name: string }[])=> {
 
    if (data.length === 0) {
      this.setState({ customer: "" });
    } else {
      getCustomerRef(this.props, data[0].name)
        .then((customerRef: string) => {
        
          cweburl="https://k6931.sharepoint.com/sites/" + customerRef;
         
          this.setState({ customer: data[0].name });
          customerreference = customerRef;
       
          
        }).then(() => {
        getcontactlistId(this.props, cweburl)
        .then((listid: string) =>{
             contactlist = listid 
              setTimeout(() =>{this.setState({weburl:cweburl},this.render);},3000)
              
        }).then(()=>{

         
          this.setState({contactlistid:contactlist},this.render)
        })
         
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    }
  }

  private onpurposeofmeetingchange = (newText: string) => {
    
    this.setState({purposeofmeeting:newText});
   
    return newText;
  }
  private onmanagementsummarychange = (newText: string) => {
    this.setState({managementsummary:newText});
   
    return newText;
  }
  private onmainminuteschange = (newText: string) => {
    this.setState({mainminutes:newText});
   
    return newText;
  }
  private onactionschange = (newText: string) => {
    this.setState({actions:newText});
   
    return newText;
  }
  private _onchangedmeetingDate=(mdate: any): void =>{  
    this.setState({ meetingdate: mdate }); 

  }

  public _getPeoplePickerItems=(items: any[]) =>{  
    console.log(items)

    if(items.length>0){
      let selectedUsers: string[] = [];
       items.map((item) => {
         selectedUsers.push(item.id);
        
       });
        this.setState({users: selectedUsers});
       console.log('users:',selectedUsers)  
      isselectedattendees  = true;
      //console.log('Items new:', userid );
    }else{
      
      isselectedattendees  = false;

    }
     
       
       
  }
  
  private _onattendesSelectedItem=(data: { key: string; name: string }[])=> {

    console.log(data)
    
    if(data.length == 0 ){
      this.setState({attendeeDropdown:""})
    }else{
      let selectedUsers: string[] = [];
       data.map((item) => {
         selectedUsers.push(item.name);
        
       }); 
    this.setState({attendeeDropdown:(JSON.stringify(selectedUsers)).slice(1, -1).replace(/"/g, '')})
    
    console.log('attendeeusers:',selectedUsers)  
   
    }
  }

  private _onmeetingtitle=(ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newText: string): void =>{ 
    //isemptybaf=isEmpty(newText)
    this.setState({meetingtitle:newText})
  
  }
  private _onlocation=(ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newText: string): void =>{ 
    //isemptybaf=isEmpty(newText)
    this.setState({location:newText})
  
  }

  private onchangeattendeesother=(ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newText: string): void =>{ 
    this.setState({attendeesother:newText})
  }

  private handleAddattendee = () => {
   const { attendeesother, interestedPartiesexternal } = this.state;
    if (attendeesother.trim() !== ''&& /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(attendeesother)) {
      const updatedParties = [...interestedPartiesexternal, attendeesother]
      console.log(updatedParties)
  
      this.setState({ interestedPartiesexternal: updatedParties, attendeesother: '', interestedPartiesexternalstr:(JSON.stringify(updatedParties)).slice(1, -1).replace(/"/g, '')});
      isemailInvalid = false;
    } else{
  
      isemailInvalid = true;
      this.setState({attendeesother:"",allfieldsvalid:false})
  
    }
  }

  private purposeofmeetinghandleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
   
  const filesNames = document.querySelector<HTMLSpanElement>('#purposeofmeetingfilesList > #purposeofmeetingfiles-names');
    for (let i = 0; i < e.target.files.length; i++) {
      let fileBloc = (
        <span key={i} className="file-block">
          <span className="name">{e.target.files.item(i).name}</span>
  <span className="file-delete">
     <button> Remove</button>
  </span>
  <br/>
        </span>
      );
  
      if (filesNames) {
        const fileBlocContainer = document.createElement('div');
        ReactDOM.render(fileBloc, fileBlocContainer);
        filesNames?.appendChild(fileBlocContainer.firstChild);
     
      }
    }
  
    for (let file of e.target.files as any) {
      this.pmdt.items.add(file);
    }
  
    e.target.files = this.pmdt.files;
  
    document.querySelectorAll('span.file-delete').forEach((button) => {
      button.addEventListener('click', () => {
        let name = button.nextSibling.textContent;
  
        (button.parentNode as HTMLElement)?.remove();
  
        for (let i = 0; i < this.pmdt.items.length; i++) {
          if (name === this.pmdt.items[i].getAsFile()?.name) {
            this.pmdt.items.remove(i);
            continue;
          }
        }
  
        e.target.files = this.pmdt.files;
  
      });
    });
  };

  private managementsummaryhandleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
   
    const filesNames = document.querySelector<HTMLSpanElement>('#managementsummaryfilesList > #managementsummaryfiles-names');
      for (let i = 0; i < e.target.files.length; i++) {
        let fileBloc = (
          <span key={i} className="file-block">
            <span className="name">{e.target.files.item(i).name}</span>
    <span className="file-delete">
       <button> Remove</button>
    </span>
    <br/>
          </span>
        );
    
        if (filesNames) {
          const fileBlocContainer = document.createElement('div');
          ReactDOM.render(fileBloc, fileBlocContainer);
          filesNames?.appendChild(fileBlocContainer.firstChild);
       
        }
      }
    
      for (let file of e.target.files as any) {
        this.msdt.items.add(file);
      }
    
      e.target.files = this.msdt.files;
    
      document.querySelectorAll('span.file-delete').forEach((button) => {
        button.addEventListener('click', () => {
          let name = button.nextSibling.textContent;
    
          (button.parentNode as HTMLElement)?.remove();
    
          for (let i = 0; i < this.msdt.items.length; i++) {
            if (name === this.msdt.items[i].getAsFile()?.name) {
              this.msdt.items.remove(i);
              continue;
            }
          }
    
          e.target.files = this.msdt.files;
    
        });
      });
    };

    private mainminuteshandleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
   
      const filesNames = document.querySelector<HTMLSpanElement>('#mainminutesfilesList > #mainminutesfiles-names');
        for (let i = 0; i < e.target.files.length; i++) {
          let fileBloc = (
            <span key={i} className="file-block">
              <span className="name">{e.target.files.item(i).name}</span>
      <span className="file-delete">
         <button> Remove</button>
      </span>
      <br/>
            </span>
          );
      
          if (filesNames) {
            const fileBlocContainer = document.createElement('div');
            ReactDOM.render(fileBloc, fileBlocContainer);
            filesNames?.appendChild(fileBlocContainer.firstChild);
         
          }
        }
      
        for (let file of e.target.files as any) {
          this.mmdt.items.add(file);
        }
      
        e.target.files = this.mmdt.files;
      
        document.querySelectorAll('span.file-delete').forEach((button) => {
          button.addEventListener('click', () => {
            let name = button.nextSibling.textContent;
      
            (button.parentNode as HTMLElement)?.remove();
      
            for (let i = 0; i < this.mmdt.items.length; i++) {
              if (name === this.mmdt.items[i].getAsFile()?.name) {
                this.mmdt.items.remove(i);
                continue;
              }
            }
      
            e.target.files = this.mmdt.files;
      
          });
        });
      };

      private _createItem  =async (props:IMeetingMinutesFormProps):Promise<void>=>{

      if(isselectedattendees==false || (this.state.attendeeDropdown).length == 0 || isEmpty(this.state.meetingtitle)||isEmpty(this.state.location) || isEmpty(this.state.purposeofmeeting) || 
      isEmpty(this.state.mainminutes) 
      )
          {
          this.setState({allfieldsvalid:false}) ; 
          console.log(this.state.allfieldsvalid)
          
          return;
          }else {
            this.setState({allfieldsvalid:true}) ; 
            isbuttondisbled = true;
            buttontext = "Saving..."
          }

          let folderUrl: string;

          const data = {
            Title: 'New Item creation in process',
            PurposeOfMeeting: this.state.purposeofmeeting,
            ManagementSummary: this.state.managementsummary,
            MainMinutes: this.state.mainminutes,
            Actions: this.state.actions,
           
          
         }; 

         submitDataAndGetId(this.props,data,cweburl).then(async (itemId: any) => {
          listId = itemId   
          console.log(`Item created with ID: ${itemId}`);
  
          //Request ID format
          let now = new Date();
          let options: Intl.DateTimeFormatOptions = {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        };
        let listIdstr
         if(listId < 1000 && listId > 100){
          listIdstr = "0"+String(listId)
        }else if(listId < 100){
          listIdstr ="00"+String(listId)
        } else if(listId < 10) {
          listIdstr ="000"+String(listId)
        }else{
          listIdstr = String(listId)
        }
        
        console.log(listIdstr)
        let formattedDate = now.toLocaleDateString('en-GB', options).replace(/\//g, '');;
        let lastitemid = (listIdstr)+"-"+"MM"+"-"+customerreference +"-" +formattedDate.toString();
  
     folderUrl =  formconst.LIBRARYNAME +"/" + lastitemid
      this.setState({title:lastitemid})
      
          
     
    }).then(async () => {
      
      await upload()
      // Update the item
      const updatedData = {
        Title: this.state.title,
        MeetingTitle:this.state.meetingtitle,
        Customer: this.state.customer,
        Location: this.state.location,
        MeetingDate: this.state.meetingdate,
        AttendeesMOLEAId: this.state.users,
        AttendeesCustomer: this.state.attendeeDropdown,
        AttendeesOther: this.state.interestedPartiesexternalstr,
        PurposeofMeetingDocuments: this.state.pmdocuments,
        ManagementSummaryDocuments:this.state.msdocuments,
        MainMinutesDocuments:this.state.mmdocuments,
        
      };
      return updateData(this.props,listId, updatedData,cweburl);
    })
     .then(() => {
      //console.log('Item Updated successfully');
      // Perform any further actions if needed
      
      isbuttondisbled = false;
      buttontext = "Submit"
      this.setState({ isSuccess: true });
    
    window.open(formconst.SUBMIT_REDIRECT(props),"_self")
    }) 
    .catch((error: any) => {
      
      var obj = JSON.stringify(error);
    
      if(obj.indexOf("400") !== -1)
      {    console.log("mATCH FOUND")
            streamerror = true;
           this.setState({allfieldsvalid:false}) 
    }
  
      else{
  
      console.log('Error:', error);}
    });
  
  
  
   
  const upload = async () => {
  
      console.log(folderUrl)
      //const _sp :SPFI = getSP(props.context) ;
      let strbgurl = "";
      let vstrbgurl = "";
      let ostrbgurl = "";
      //_sp.web.folders.addUsingPath(folderUrl);
      // bgfiles
      
      let bgfileurl = [];

      let bginput = document.getElementById("purposeofmeetingattachment") as HTMLInputElement;
  
      console.log(bginput.files);
    
      if (bginput.files.length > 0) {
        let bgfiles = bginput.files;
      
        for (var i = 0; i < bgfiles.length; i++) {
          let bgfile = bginput.files[i];
          console.log("bgfile",bgfile)
          bgfileurl.push(this.props.siteUrl+ "/" + folderUrl + "/" +bgfile.name);
          //console.log()
          try {
            await uploadAttachment(this.props,folderUrl,bgfile.name, bgfile,this.state.title,cweburl)
           
          } catch (err) {
            console.error("Error uploading file:", err);
          }
        }
        let convertedStr = bgfileurl.map(url => `<a href="${url.trim()}" target="_blank">${url.trim()}</a>`);
         strbgurl = convertedStr.toString();
          //console.log(strbgurl);
          this.setState({ pmdocuments: strbgurl });
      }
        
       else {
        console.log("No file selected for upload.");
      }
      // vfiles
      let vfileurl = [];
      let vinput = document.getElementById("managementsummaryattachment") as HTMLInputElement;
 
      console.log(vinput.files);
      if (vinput.files.length > 0) {
        let vfiles = vinput.files;
      
        for (var i = 0; i < vfiles.length; i++) {
          let vfile = vinput.files[i];
          console.log("vfile",vfile)
          vfileurl.push(this.props.siteUrl + "/" + folderUrl + "/" + vfile.name);
          try {
             await uploadAttachment(this.props,folderUrl,vfile.name, vfile,this.state.title,cweburl)
            
          } catch (err) {
            console.error("Error uploading file:", err);
          }
        }
        let vconvertedStr = vfileurl.map(url => `<a href="${url.trim()}" target="_blank">${url.trim()}</a>`);
       vstrbgurl = vconvertedStr.toString();
      //console.log(vstrbgurl);
      this.setState({ msdocuments: vstrbgurl });
      
      } else {
        console.log("No file selected for upload.");
        
      }
      
    
      // ofiles
      let ofileurl = [];
      let oinput = document.getElementById("mainminutesattachment") as HTMLInputElement;
  
      console.log(oinput.files);
     
      if (oinput.files.length > 0) {
        let ofiles = oinput.files;
     
        for (var i = 0; i < ofiles.length; i++) {
          let ofile = oinput.files[i];
          console.log("ofile",ofile)
          ofileurl.push(this.props.siteUrl+ "/" + folderUrl + "/" + ofile.name);
          try {
             await uploadAttachment(this.props,folderUrl,ofile.name, ofile,this.state.title,cweburl)
            
          } catch (err) {
            console.error("Error uploading file:", err);
          }
        }
        let oconvertedStr = ofileurl.map(url => `<a href="${url.trim()}" target="_blank">${url.trim()}</a>`);
         ostrbgurl = oconvertedStr.toString();
        //console.log(ostrbgurl);
        this.setState({ mmdocuments: ostrbgurl });
        
      } else {
        console.log("No file selected for upload.");
        
      }

    }

    }

      private cancel =()=>{
        window.open(formconst.CANCEL_REDIRECT(this.props),"_self");
      }

      private _resetrichtext = () =>{
 
        this.setState({purposeofmeeting:"", managementsummary:"",mainminutes:"", actions:"",allfieldsvalid:true})
        streamerror = false;
        isbuttondisbled = false;
        buttontext = "Submit"
      
      }


  public render(): React.ReactElement<IMeetingMinutesFormProps> {
    const {interestedPartiesexternal } = this.state;
    let EmailFieldErrorMessage: JSX.Element | null
    let imageFieldErrorMessage: JSX.Element | null
    let successMessage : JSX.Element | null
    let meetingtitleFieldErrorMessage : JSX.Element | null
    let locationFieldErrorMessage : JSX.Element | null
    let pmFieldErrorMessage : JSX.Element | null
    let mmFieldErrorMessage : JSX.Element | null
    let attendeeFieldErrorMessage : JSX.Element | null
    let attcustFieldErrorMessage : JSX.Element | null
    let FormFieldErrorMessage : JSX.Element | null

    
    if(!this.state.allfieldsvalid){
      
      attendeeFieldErrorMessage = (isselectedattendees==false) ?
        <MessageBar messageBarType={MessageBarType.error}>Attendees (MOLEA)
        is required.</MessageBar>
        : null;
      meetingtitleFieldErrorMessage = isEmpty(this.state.meetingtitle) ?
        <MessageBar messageBarType={MessageBarType.error}>Meeting Title is required.</MessageBar>
        : null;
      locationFieldErrorMessage = isEmpty(this.state.location) ?
        <MessageBar messageBarType={MessageBarType.error}>Location is required.</MessageBar>
        : null;  
        pmFieldErrorMessage = isEmpty(this.state.purposeofmeeting) ?
        <MessageBar messageBarType={MessageBarType.error}>Purpose of Meeting
        is required.</MessageBar>
        : null; 
        mmFieldErrorMessage = isEmpty(this.state.mainminutes) ?
        <MessageBar messageBarType={MessageBarType.error}>Main Minutes
        is required.</MessageBar>
        : null; 
      
      attcustFieldErrorMessage = (this.state.attendeeDropdown).length == 0  ?
        <MessageBar messageBarType={MessageBarType.error}>Attendees (Customer)
        is required.</MessageBar>
        : null;


      EmailFieldErrorMessage= isemailInvalid ?
      <MessageBar messageBarType={MessageBarType.error}>Please enter a valid email address.</MessageBar>
      : null;
      imageFieldErrorMessage = streamerror ? <MessageBar messageBarType={MessageBarType.blocked} isMultiline={false} onDismiss={this._resetrichtext} dismissButtonAriaLabel="Close"
      truncated={true} overflowButtonAriaLabel="See more">Stream size exceeds the allowed limit. Note that the image size in the rich text field should be less than 80 KB .
      On closing the dialog will reset the rich text field values </MessageBar>: null;
       FormFieldErrorMessage= 
       <MessageBar messageBarType={MessageBarType.error}>Please provide all required information and submit the form.</MessageBar>
    
    }

    successMessage = this.state.isSuccess ?
    <MessageBar messageBarType={MessageBarType.success}>Meeting Id : {this.state.title} submitted successfully.</MessageBar>
    : null;
 
   return (
      <section>
        <div>
       
          <div>
          <p><span className={styles.required}><b>*</b></span> Required.</p>
          </div>
          <p className={styles.heading}>Overview</p>

         
          <p className={styles.formlabel}>Customer<span className={styles.required}> *</span></p>
          
          {
              isCustomerWorkspace === "Yes" ? (
                <div>

                  
                  <Label>{this.state.customer}</Label>
                </div>
              ) : (
               
                <ListItemPicker
                  listId={formconst.CUSTOMER_LIST_ID}
                  context={this.props.context as any}
                  webUrl={formconst.CUSTOMER_URL}
                  columnInternalName="Title"
                  keyColumnInternalName="Id"
                  placeholder="Select your Customer"
                  substringSearch={true}
                  orderBy={"Title"}
                  itemLimit={1}
                  enableDefaultSuggestions={true}
                  onSelectedItem={this._oncustomerSelectedItem}
                  noResultsFoundText="No Customer Found"
                  defaultSelectedItems={[]}
                />
              )
            }

        <p className={styles.formlabel}>Meeting Title<span className={styles.required}> *</span></p>  
        <TextField value={this.state.meetingtitle} onChange={this._onmeetingtitle} />{meetingtitleFieldErrorMessage}

        <p className={styles.formlabel}>Meeting Date<span className={styles.required}> *</span></p> 
        <DateTimePicker 
          dateConvention={DateConvention.Date}
          value={this.state.meetingdate}  
          onChange={this._onchangedmeetingDate}
          allowTextInput = {false}  
          showLabels = {false}/>

        <p className={styles.formlabel}>Location<span className={styles.required}> *</span></p>  
        <TextField value={this.state.location} onChange={this._onlocation}/>{locationFieldErrorMessage}
        <p className={styles.heading}>Attendees</p>
        <PeoplePicker
            context={this.props.context as any}
            titleText="Attendees (MOLEA)"
            placeholder='Select your Attendees'
            defaultSelectedUsers = {[]}
            personSelectionLimit={10}
            groupName={""} // Leave this blank in case you want to filter from all users
            ensureUser={true}
            showtooltip={false}
            suggestionsLimit={5}
            required={true}
            disabled={false}
            onChange={this._getPeoplePickerItems}
            showHiddenInUI={false}
            principalTypes={[PrincipalType.User]}
            resolveDelay={1000}
    />{attendeeFieldErrorMessage}
      
         <p className={styles.formlabel}>Attendees (Customer)<span className={styles.required}> *</span></p>
         {console.log("nn",contactlist)}
        {isCustomerWorkspace === "No"  ? (
          
            <ListItemPicker
              listId={contactlist}
              context={this.props.context as any}
              webUrl={cweburl}
              columnInternalName='calFullName'
              //keyColumnInternalName='ID'
              placeholder="Search your Customer"
              substringSearch={true}
              orderBy={"calFullName"}
              itemLimit={10}
              disabled={false}
              enableDefaultSuggestions={false}
              onSelectedItem={this._onattendesSelectedItem}
              noResultsFoundText="No Attendees Found"
              defaultSelectedItems={[]}
              key={contactlist}
            />
          ) : (
            <ListItemPicker
              listId={formconst.CONTACTS_LIST_NAME}
              context={this.props.context as any}
         
              columnInternalName='calFullName'
              //keyColumnInternalName='ID'
              placeholder="Search your Customer"
              substringSearch={true}
              orderBy={"calFullName"}
              itemLimit={10}
              disabled={false}
              enableDefaultSuggestions={true}
              onSelectedItem={this._onattendesSelectedItem}
              noResultsFoundText="No Attendees Found"
              defaultSelectedItems={[]}
            />
          )} 
          {attcustFieldErrorMessage}

          <Stack horizontal verticalAlign="end" className={styles.attendeesotherstackContainer }>
          <TextField
            label="Attendees (Other)"
            value={this.state.attendeesother}
            styles={textFieldStyles as IStyleFunctionOrObject<ITextFieldStyleProps, ITextFieldStyles>}
            onChange={this.onchangeattendeesother}
          
          />
          <PrimaryButton text="+" onClick={this.handleAddattendee} />
        </Stack>
        <div>
          {interestedPartiesexternal.map((party: any, index: React.Key) => (
            <span key={index}>{party}{index !== interestedPartiesexternal.length - 1 && '; '}</span>
          ))}
        </div>    
        <br/>
        {EmailFieldErrorMessage}
        <p className={styles.heading}>Meeting Details</p>    
         <p className={styles.formlabel}>Purpose of Meeting<span className={styles.required}> *</span></p>
         <ReactQuill
          modules={formconst.modules}    
          formats={formconst.formats}  
          value={this.state.purposeofmeeting}  onChange={(text)=>this.onpurposeofmeetingchange(text)}  
      ></ReactQuill> {pmFieldErrorMessage}
         <div id = "purposeofmeeting" className="mt-5 text-center">
        <label htmlFor="purposeofmeetingattachment" className="btn btn-primary text-light" role="button" aria-disabled="false">
          + Add Supporting Documents
        </label>
        <input
          type="file"
          name="file[]"
          accept=""
          id="purposeofmeetingattachment"
          style={{ visibility: 'hidden', position: 'absolute' }}
          multiple
          onChange={this.purposeofmeetinghandleFileUpload}
        />

        <p id="purposeofmeetingfiles-area">
          <span id="purposeofmeetingfilesList">
            <span ref={this.filesNamesRef} id="purposeofmeetingfiles-names"></span>
          </span>
        </p>
      </div>

      <p className={styles.formlabel}>Management Summary</p>
         <ReactQuill theme='snow'
          modules={formconst.modules}    
          formats={formconst.formats}  
          value={this.state.managementsummary}  onChange={(text)=>this.onmanagementsummarychange(text)}  
      ></ReactQuill> 
       <div id = "managementsummary" className="mt-5 text-center">
        <label htmlFor="managementsummaryattachment" className="btn btn-primary text-light" role="button" aria-disabled="false">
          + Add Supporting Documents
        </label>
        <input
          type="file"
          name="file[]"
          accept=""
          id="managementsummaryattachment"
          style={{ visibility: 'hidden', position: 'absolute' }}
          multiple
          onChange={this.managementsummaryhandleFileUpload}
        />

        <p id="managementsummaryfiles-area">
          <span id="managementsummaryfilesList">
            <span ref={this.filesNamesRef} id="managementsummaryfiles-names"></span>
          </span>
        </p>
      </div>

      <p className={styles.formlabel}>Main Minutes<span className={styles.required}> *</span></p>
         <ReactQuill theme='snow'
          modules={formconst.modules}    
          formats={formconst.formats}  
          value={this.state.mainminutes}  onChange={(text)=>this.onmainminuteschange(text)}  
      ></ReactQuill> {mmFieldErrorMessage}
       <div id = "mainminutes" className="mt-5 text-center">
        <label htmlFor="mainminutesattachment" className="btn btn-primary text-light" role="button" aria-disabled="false">
          + Add Supporting Documents
        </label>
        <input
          type="file"
          name="file[]"
          accept=""
          id="mainminutesattachment"
          style={{ visibility: 'hidden', position: 'absolute' }}
          multiple
          onChange={this.mainminuteshandleFileUpload}
        />

        <p id="mainminutesfiles-area">
          <span id="mainminutesfilesList">
            <span ref={this.filesNamesRef} id="mainminutesfiles-names"></span>
          </span>
        </p>
      </div>

      <p className={styles.formlabel}>Actions</p>
         <ReactQuill theme='snow'
          modules={formconst.modules}    
          formats={formconst.formats}  
          value={this.state.actions}  onChange={(text)=>this.onactionschange(text)}  
      ></ReactQuill></div>
      <br />
      <Stack horizontal horizontalAlign='end' className={styles.stackContainer}>     
      <PrimaryButton text={buttontext} onClick={() => this._createItem(this.props)} disabled= {isbuttondisbled}/>
      <PrimaryButton text="Cancel"  onClick ={this.cancel}/>
   
      </Stack> 
      <br />
      {imageFieldErrorMessage}
      <br />
      {FormFieldErrorMessage}
      {successMessage}
      </section>

    );
  }
  
}
