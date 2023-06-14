export const LISTNAME ="Meeting Minutes";
export const METADATA_LISTNAME ="Metadata";
export const CONTACTS_LIST_ID ="1b5dc2b0-36ca-4507-8839-b09fce7b69a0";
export const LIBRARYNAME = "Shared Documents";
export const WEB_URL= "https://k6931.sharepoint.com/sites/Rupankana";  
export const CANCEL_REDIRECT = "https://k6931.sharepoint.com/sites/Rupankana/SitePages/Home.aspx";
export const SUBMIT_REDIRECT = "https://k6931.sharepoint.com/sites/Rupankana/SitePages/Destination.aspx";



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