<%@ WebHandler Language="C#" Class="_1" %>

using System;
using System.Web;

public class _1 : IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "text/plain";
        object o=new {totalRow=10,data="dsd"};
        System.Web.Script.Serialization.JavaScriptSerializer s = new System.Web.Script.Serialization.JavaScriptSerializer();
        context.Response.Write(s.Serialize(o));
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}