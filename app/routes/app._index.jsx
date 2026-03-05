import { useLoaderData, useFetcher } from "react-router";
import { useState } from "react";
import { authenticate } from "../shopify.server";
import { PrismaClient } from "@prisma/client";

const getDB = () => new PrismaClient();

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  const db = getDB();
  let settings = await db.settings.findUnique({ where: { shop } });
  if (!settings) {
    settings = await db.settings.create({ data: { shop } });
  }
  const wishlistCount = await db.wishlistItem.count({ where: { shop } });
  const customerCount = await db.wishlistItem.groupBy({ by: ["customerId"], where: { shop } });
  const productCount = await db.wishlistItem.groupBy({ by: ["productId"], where: { shop } });
  await db.$disconnect();
  return { settings, stats: { wishlists: wishlistCount, customers: customerCount.length, products: productCount.length } };
};

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  const db = getDB();
  const formData = await request.formData();
  const data = {
    buttonText: formData.get("buttonText") || "Add to Wishlist",
    buttonColor: formData.get("buttonColor") || "#e44444",
    buttonStyle: formData.get("buttonStyle") || "Icon + Text",
    iconStyle: formData.get("iconStyle") || "❤️",
    launchType: formData.get("launchType") || "Floating Button",
    buttonPosition: formData.get("buttonPosition") || "Bottom Right",
    wishlistDisplay: formData.get("wishlistDisplay") || "Popup Window",
    wishlistName: formData.get("wishlistName") || "My Wishlist",
    requireLogin: formData.get("requireLogin") === "on",
  };
  const settings = await db.settings.upsert({ where: { shop }, update: data, create: { shop, ...data } });
  await db.$disconnect();
  return { success: true, settings };
};

export default function Dashboard() {
  const { settings, stats } = useLoaderData();
  const fetcher = useFetcher();
  const saved = fetcher.data?.success;
  const currentSettings = fetcher.data?.settings || settings;
  const [selectedIcon, setSelectedIcon] = useState(currentSettings.iconStyle || "❤️");

  return (
    <div style={{fontFamily:"sans-serif",background:"#f6f6f7",minHeight:"100vh"}}>
      <div style={{background:"#fff",borderBottom:"1px solid #e1e3e5",padding:"16px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:24}}>❤️</span>
          <h1 style={{fontSize:20,fontWeight:700,margin:0}}>Wishlist App</h1>
        </div>
        <span style={{background:"#008060",color:"#fff",padding:"6px 16px",borderRadius:6,fontSize:13,fontWeight:600}}>Active</span>
      </div>

      {saved && (
        <div style={{background:"#d4edda",color:"#155724",padding:"12px 24px",textAlign:"center",fontWeight:600,fontSize:15}}>
          ✅ Settings saved successfully!
        </div>
      )}

      <div style={{padding:"24px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:24}}>
          {[{label:"Total Wishlists",value:stats.wishlists,icon:"📋"},{label:"Products Wishlisted",value:stats.products,icon:"🛍️"},{label:"Customers",value:stats.customers,icon:"👥"}].map(({label,value,icon})=>(
            <div key={label} style={{background:"#fff",borderRadius:12,padding:"20px 24px",boxShadow:"0 1px 4px rgba(0,0,0,0.08)"}}>
              <div style={{fontSize:28,marginBottom:4}}>{icon}</div>
              <div style={{fontSize:28,fontWeight:700,marginBottom:4}}>{value}</div>
              <div style={{fontSize:13,color:"#6d7175"}}>{label}</div>
            </div>
          ))}
        </div>

        <fetcher.Form method="post">
          <input type="hidden" name="iconStyle" value={selectedIcon} />
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div style={{background:"#fff",borderRadius:12,padding:24,boxShadow:"0 1px 4px rgba(0,0,0,0.08)"}}>
              <h2 style={{fontSize:16,fontWeight:700,marginBottom:20,paddingBottom:12,borderBottom:"1px solid #f0f0f0"}}>Button Settings</h2>
              <div style={{marginBottom:16}}>
                <label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:8}}>Button Text</label>
                <input name="buttonText" defaultValue={currentSettings.buttonText} style={{width:"100%",padding:"8px 12px",border:"1px solid #d1d5db",borderRadius:8,fontSize:14,boxSizing:"border-box"}} />
              </div>
              <div style={{marginBottom:16}}>
                <label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:8}}>Button Color</label>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <input type="color" name="buttonColor" defaultValue={currentSettings.buttonColor} style={{width:40,height:36,border:"1px solid #d1d5db",borderRadius:6,cursor:"pointer",padding:2}} />
                  <span style={{padding:"8px 12px",border:"1px solid #d1d5db",borderRadius:8,fontSize:14,background:"#f9fafb"}}>{currentSettings.buttonColor}</span>
                </div>
              </div>
              <div style={{marginBottom:16}}>
                <label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:8}}>Button Style</label>
                <select name="buttonStyle" defaultValue={currentSettings.buttonStyle} style={{width:"100%",padding:"8px 12px",border:"1px solid #d1d5db",borderRadius:8,fontSize:14}}>
                  <option>Icon + Text</option>
                  <option>Text Only</option>
                  <option>Icon Only</option>
                </select>
              </div>
              <div style={{marginBottom:20}}>
                <label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:8}}>Icon Style</label>
                <div style={{display:"flex",gap:8}}>
                  {["❤️","🤍","♡","★"].map(icon=>(
                    <button type="button" key={icon} onClick={()=>setSelectedIcon(icon)}
                      style={{width:44,height:44,border:selectedIcon===icon?"3px solid #008060":"2px solid #d1d5db",borderRadius:8,background:selectedIcon===icon?"#e6f4f1":"#fff",cursor:"pointer",fontSize:20}}>
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" style={{width:"100%",padding:"10px",background:"#008060",color:"#fff",border:"none",borderRadius:8,fontWeight:600,fontSize:14,cursor:"pointer"}}>
                {fetcher.state==="submitting"?"Saving...":"💾 Save Settings"}
              </button>
            </div>

            <div style={{background:"#fff",borderRadius:12,padding:24,boxShadow:"0 1px 4px rgba(0,0,0,0.08)"}}>
              <h2 style={{fontSize:16,fontWeight:700,marginBottom:20,paddingBottom:12,borderBottom:"1px solid #f0f0f0"}}>Display Settings</h2>
              <div style={{marginBottom:16}}>
                <label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:8}}>Launch Type</label>
                <select name="launchType" defaultValue={currentSettings.launchType} style={{width:"100%",padding:"8px 12px",border:"1px solid #d1d5db",borderRadius:8,fontSize:14}}>
                  <option>Floating Button</option>
                  <option>Menu Item</option>
                  <option>Header Icon</option>
                </select>
              </div>
              <div style={{marginBottom:16}}>
                <label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:8}}>Button Position</label>
                <select name="buttonPosition" defaultValue={currentSettings.buttonPosition} style={{width:"100%",padding:"8px 12px",border:"1px solid #d1d5db",borderRadius:8,fontSize:14}}>
                  <option>Bottom Right</option>
                  <option>Bottom Left</option>
                  <option>Top Right</option>
                  <option>Top Left</option>
                </select>
              </div>
              <div style={{marginBottom:16}}>
                <label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:8}}>Wishlist Page Display</label>
                <select name="wishlistDisplay" defaultValue={currentSettings.wishlistDisplay} style={{width:"100%",padding:"8px 12px",border:"1px solid #d1d5db",borderRadius:8,fontSize:14}}>
                  <option>Popup Window</option>
                  <option>Separate Page</option>
                  <option>Side Drawer</option>
                </select>
              </div>
              <div style={{marginBottom:16}}>
                <label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:8}}>Wishlist Name</label>
                <input name="wishlistName" defaultValue={currentSettings.wishlistName} style={{width:"100%",padding:"8px 12px",border:"1px solid #d1d5db",borderRadius:8,fontSize:14,boxSizing:"border-box"}} />
              </div>
              <div style={{marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px",background:"#f9fafb",borderRadius:8}}>
                <div>
                  <div style={{fontSize:13,fontWeight:600}}>Require Login</div>
                  <div style={{fontSize:12,color:"#6d7175"}}>Customers must login to save wishlist</div>
                </div>
                <input type="checkbox" name="requireLogin" defaultChecked={currentSettings.requireLogin} style={{width:18,height:18,cursor:"pointer"}} />
              </div>
              <button type="submit" style={{width:"100%",padding:"10px",background:"#008060",color:"#fff",border:"none",borderRadius:8,fontWeight:600,fontSize:14,cursor:"pointer"}}>
                {fetcher.state==="submitting"?"Saving...":"💾 Save Settings"}
              </button>
            </div>
          </div>
        </fetcher.Form>
      </div>
    </div>
  );
}
