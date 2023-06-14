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

  

  

   
  

 
  
  
  
  
  
  
  
  
  