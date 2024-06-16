export interface NewPost{
      file:File[];
      userId: number|string;
      caption: string;
      tags: string;
      location: string;
    
  
  }


  export interface UpdatedPost{
    file?:File[];
    userId: number|string;
    caption: string;
    tags: string;
    location: string;
  

}