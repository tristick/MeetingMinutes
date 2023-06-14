import { SPFI } from "@pnp/sp";

import { getSP } from "../pnpjsconfig";
import { IMeetingMinutesFormProps } from "../webparts/meetingMinutesForm/components/IMeetingMinutesFormProps";
import * as formconst from "../webparts/constant";






export const getCustomerItem= async (props:IMeetingMinutesFormProps) => {
    const _sp :SPFI = getSP(props.context) ;
    return new Promise((resolve,reject) =>{
      _sp.web.lists.getByTitle(formconst.METADATA_LISTNAME).items.select("Title","RefCode").orderBy("ID", false).top(1)()
      .then((items) => {
        if (items.length > 0) {
        
        console.log(items) 
          resolve(items);
        } else {
          reject(new Error("Customer not found"));
        }

    }).catch((error) => {
      reject(error);
    });
});
}
    
export const submitDataAndGetId = async (props:IMeetingMinutesFormProps,data:any): Promise<any> => {
  
  const _sp :SPFI = getSP(props.context) ;
 
  return _sp.web.lists.getByTitle(formconst.LISTNAME).items.add(data)
    .then((response) => {
      console.log(response)
     
        const itemId = response.data.Id;

        console.log("ID",itemId)
        // Resolve the promise with the item ID
        return Promise.resolve(itemId);
    })
    .catch((error) => {
        // Handle any errors that occurred during the request
        return Promise.reject(error);
    });

  
}


export const updateData=(props:IMeetingMinutesFormProps ,itemId: number, data: any): Promise<void>=> {
  const _sp :SPFI = getSP(props.context) ;
  return new Promise<void>((resolve, reject) => {
    _sp.web.lists.getByTitle(formconst.LISTNAME).items.getById(itemId).update(data)
      .then(() => {
        
        //console.log(e.response.headers.get("content-length"))
        resolve();
      })
      .catch((error) => {
 
        reject(error);
      });
  });
}

  
  /* export const getLatestItemId= async (props:ITrpreqfrmProps):Promise<ITrc[]>=> {
    const _sp :SPFI = getSP(props.context) ;
    const items = await _sp.web.lists.getByTitle(formconst.LISTNAME).items.orderBy("ID", false).top(1)();
    return items;
    //return items.length > 0 ? items[0].ID : 0;
  }

  export const getCustomerRef=(props:ITrpreqfrmProps,customerName: string) => {
    console.log(customerName)
    const _sp :SPFI = getSP(props.context) ;
    return new Promise((resolve, reject) => {
      _sp.web.lists.getByTitle(formconst.CUSTOMER_LISTNAME).items.select("RefCode").filter(`Title eq '${customerName}'`)()
        .then((items) => {
          if (items.length > 0) {
            const customerRef = items[0].RefCode;
            console.log(customerRef)
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




  export const getOfficeRef=(props:ITrpreqfrmProps,officeName: string) => {
    console.log(officeName)
    const _sp :SPFI = getSP(props.context) ;
    return new Promise((resolve, reject) => {
      _sp.web.lists.getByTitle(formconst.REQUEST_LISTNAME).items.select("RefCode").filter(`Title eq '${officeName}'`)()
        .then((items) => {
          if (items.length > 0) {
            const officeRef = items[0].RefCode;
            console.log(officeRef)
            resolve(officeRef);
          } else {
            reject(new Error("Office not found"));
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }


  export async function checklistFolderExistence(props:ITrpreqfrmProps,folderPath: string): Promise<boolean> {
   
    folderPath = folderPath.replace(formconst.BASE_URL, "");
      const _sp :SPFI = getSP(props.context) ;
      console.log(folderPath);
      const listfolder = await  _sp.web.getFolderByServerRelativePath(folderPath).select('Exists')();
      if(listfolder.Exists){
      return true;
      }else{return false;} // Folder exists
    
  }
  export async function checklibFolderExistence(props:ITrpreqfrmProps,folderPath: string): Promise<boolean> {
    folderPath = folderPath.replace(formconst.BASE_URL, "");
    console.log(folderPath)
    const _sp :SPFI = getSP(props.context) ;
    const listfolder = await _sp.web.getFolderByServerRelativePath(folderPath).select('Exists')();
    if(listfolder.Exists){
    return true;
    }else{return false;} // Folder exists
  
}


export const getItem= async (props:ITrpreqfrmProps,key:string):Promise<ITrc[]>=> {

  console.log(key)
  const _sp :SPFI = getSP(props.context) ;
  const items  =_sp.web.lists.getByTitle(formconst.LISTNAME).items.filter(`Title eq '${key}'`)()
    
  console.log('items',items);
  return items;
    
    
}
 */

  

   
  

 
  
  
  
  
  
  
  
  
  