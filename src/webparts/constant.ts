export const LISTNAME ="Meeting Minutes";
export const METADATA_LISTNAME ="Metadata";
export const CONTACTS_LIST_NAME ="Contacts";
export const LIBRARYNAME = "Shared Documents";
export const CANCEL_REDIRECT = "https://k6931.sharepoint.com/sites/Commercialhub";
export const SUBMIT_REDIRECT = "https://k6931.sharepoint.com/sites/Commercialhub";



export const modules = {  
    toolbar: [  
        [{  
            'header': [1, 2, 3, false]  
        }],  
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],  
         
        [{  
            'list': 'ordered'  
        }, {  
            'list': 'bullet'  
        }, {  
            'indent': '-1'  
        }, {  
            'indent': '+1'  
        }],  
        ['image']  
        
    ],  
};
export const formats = ['header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent', 'image', 'background', 'color']; 