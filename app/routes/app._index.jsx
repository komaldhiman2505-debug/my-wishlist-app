
import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return {};
};

export default function Dashboard() {
  return (
    <div style={{fontFamily:"sans-serif",padding:"24px",maxWidth:1100,margin:"0 auto"}}>
      <h1 style={{fontSize:28,marginBottom:4}}>Wishlist App Dashboard</h1>
      <p style={{color:"#666",marginBottom:32}}>Manage your store wishlist settings</p>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20,marginBottom:32}}>
        {[["Total Wishlists","0"],["Products Wishlisted","0"],["Customers","0"]].map(([label,val])=>(
          <div key={label} style={{background:"#fff",border:"1px solid #eee",borderRadius:12,padding:24,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
            <div style={{fontSize:14,color:"#888",marginBottom:8}}>{label}</div>
            <div style={{fontSize:36,fontWeight:700}}>{val}</div>
          </div>
        ))}
      </div>

      <div style={{background:"#fff",border:"1px solid #eee",borderRadius:12,padding:24,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
        <h2 style={{fontSize:20,marginBottom:20}}>Wishlist Button Settings</h2>
        
        <div style={{marginBottom:20}}>
          <label style={{fontWeight:600,display:"block",marginBottom:8}}>Button Color</label>
          <input type="color" defaultValue="#e44444" style={{width:60,height:40,border:"none",cursor:"pointer"}} />
        </div>

        <div style={{marginBottom:20}}>
          <label style={{fontWeight:600,display:"block",marginBottom:8}}>Button Position</label>
          <select style={{padding:"8px 16px",borderRadius:8,border:"1px solid #ddd",fontSize:14}}>
            <option>Bottom Right</option>
            <option>Bottom Left</option>
            <option>Top Right</option>
          </select>
        </div>

        <div style={{marginBottom:20}}>
          <label style={{fontWeight:600,display:"block",marginBottom:8}}>Button Style</label>
          <div style={{display:"flex",gap:12}}>
            {["Heart Icon","Text Button","Icon + Text"].map(style=>(
              <button key={style} style={{padding:"10px 20px",border:"2px solid #e44",borderRadius:8,background:"#fff",cursor:"pointer",fontWeight:600,color:"#e44"}}>{style}</button>
            ))}
          </div>
        </div>

        <button style={{padding:"12px 32px",background:"#e44",color:"#fff",border:"none",borderRadius:8,fontWeight:600,fontSize:16,cursor:"pointer"}}>
          Save Settings
        </button>
      </div>
    </div>
  );
}
