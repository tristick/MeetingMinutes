import { SPFI, SPFx } from "@pnp/sp";
import { getSP } from "../pnpjsconfig";
import { IMeetingMinutesFormProps } from "../webparts/meetingMinutesForm/components/IMeetingMinutesFormProps";
import * as formconst from "../webparts/constant";
import { Web } from "@pnp/sp/webs";

export const getCustomerItem= async (props:IMeetingMinutesFormProps) => {
    const _sp :SPFI = getSP(props.context) ;
    return new Promise((resolve,reject) =>{
      _sp.web.lists.getByTitle(formconst.METADATA_LISTNAME).items.select("Title","RefCode").orderBy("ID", false).top(1)()
      .then((items) => {
        if (items.length > 0) {
        
        //console.log(items) 
          resolve(items);
        } else {
          reject(new Error("Customer not found"));
          //resolve("null")
        }

    }).catch(() => {
      resolve("null");
    });
});
}
    

export const getCustomerRef=(props:IMeetingMinutesFormProps,customerName: string) => {
  //console.log(customerName)
  const _web = Web(formconst.CUSTOMER_URL).using(SPFx(props.context));
  return new Promise((resolve, reject) => {
    _web.lists.getByTitle(formconst.CUSTOMER_LISTNAME).items.select("RefCode").filter(`Title eq '${customerName}'`)()
      .then((items) => {
        if (items.length > 0) {
          const customerRef = items[0].RefCode;
          
          resolve(customerRef);
        } else {
          reject(new Error("Customer not found"));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export const getcontactlistId = (props:IMeetingMinutesFormProps,weburl:string) => {

  const _web = Web(weburl).using(SPFx(props.context));
  return new Promise((resolve, reject) => {
    _web.lists.getByTitle(formconst.CONTACTS_LIST_NAME).select("Id")()
  .then((list) => {
    const listId = list.Id;
  
    resolve(listId)
  })
  .catch((error) => {
    reject(error);
  });


})}

export const submitDataAndGetId = async (props:IMeetingMinutesFormProps,data:any,weburl?:any): Promise<any> => {
  
  const _sp :SPFI = getSP(props.context) ;

  let appurl = weburl !== undefined ? Web(weburl).using(SPFx(props.context)):_sp.web

  return appurl.lists.getByTitle(formconst.LISTNAME).items.add(data)
    .then((response) => {
      console.log(response)
     
        const itemId = response.data.Id;

        console.log("ID",itemId)
        
        return Promise.resolve(itemId);
    })
    .catch((error) => {
       
        return Promise.reject(error);
    });

  
}


export const updateData=(props:IMeetingMinutesFormProps ,itemId: number, data: any,weburl?:any): Promise<void>=> {
  const _sp :SPFI = getSP(props.context) ;
  
  let appurl = weburl !== undefined ? Web(weburl).using(SPFx(props.context)):_sp.web
  return new Promise<void>((resolve, reject) => {
    appurl.lists.getByTitle(formconst.LISTNAME).items.getById(itemId).update(data)
      .then(() => {
        
        resolve();
      })
      .catch((error) => {
 
        reject(error);
      });
  });
}

export const uploadAttachment = (props:IMeetingMinutesFormProps,folderUrl:any,filename:any, file:any,meetingid:string,weburl?:any)=>{

  const _sp :SPFI = getSP(props.context) ;
  let appurl = weburl !== undefined ? Web(weburl).using(SPFx(props.context)):_sp.web
  appurl.folders.addUsingPath(folderUrl);
    return new Promise((resolve,reject) =>{
      appurl.getFolderByServerRelativePath(folderUrl).files.addChunked(filename, file)
      .then((items) => {
        
        items.file.getItem().then((item)=>{

          item.update({MeetingId:meetingid})
        })
     
        resolve(items);
      })
    }).catch((error) => {
      reject(error);
    });


  
}

  

  

   
  

 
  
  
  
  
  
  
  
  

function reject(error: any) {
  throw new Error("Function not implemented.");
}
  