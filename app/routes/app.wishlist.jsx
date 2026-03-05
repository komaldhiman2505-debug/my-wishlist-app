import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import { useState } from "react";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const response = await admin.graphql(`query { products(first: 20) { edges { node { id title priceRangeV2 { minVariantPrice { amount currencyCode } } images(first: 1) { edges { node { url altText } } } } } } }`);
  const data = await response.json();
  return Response.json({ products: data.data.products.edges });
};

export default function WishlistPage() {
  const { products } = useLoaderData();
  const [wishlist, setWishlist] = useState([]);
  const [notif, setNotif] = useState(null);
  const showNotif = (msg) => { setNotif(msg); setTimeout(() => setNotif(null), 2500); };
  const toggle = (id, title) => { setWishlist(prev => { const isIn = prev.includes(id); showNotif(isIn ? "Removed!" : title + " added!"); return isIn ? prev.filter(x => x !== id) : [...prev, id]; }); };
  return (
    <div style={{fontFamily:"sans-serif",padding:"20px",maxWidth:1100,margin:"0 auto"}}>
      {notif && <div style={{position:"fixed",top:20,right:20,background:"#333",color:"#fff",padding:"12px 20px",borderRadius:8,zIndex:9999}}>{notif}</div>}
      <h1>Wishlist App - {wishlist.length} items saved</h1>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(220px, 1fr))",gap:20}}>
        {products.map(({node:p}) => {
          const img = p.images.edges[0]?.node;
          const price = p.priceRangeV2.minVariantPrice;
          const isIn = wishlist.includes(p.id);
          return (
            <div key={p.id} style={{border:"1px solid #eee",borderRadius:12,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.08)"}}>
              {img ? <img src={img.url} alt={p.title} style={{width:"100%",height:200,objectFit:"cover"}} /> : <div style={{height:200,background:"#f5f5f5",display:"flex",alignItems:"center",justifyContent:"center"}}>No Image</div>}
              <div style={{padding:16}}>
                <div style={{fontWeight:600,marginBottom:6}}>{p.title}</div>
                <div style={{color:"#e44",fontWeight:700,marginBottom:12}}>{parseFloat(price.amount).toFixed(2)} {price.currencyCode}</div>
                <button onClick={() => toggle(p.id, p.title)} style={{width:"100%",padding:"10px",border:"none",borderRadius:8,background:isIn?"#ffe4e4":"#f5f5f5",color:isIn?"#e44":"#333",fontWeight:600,cursor:"pointer"}}>
                  {isIn ? "Wishlisted" : "Add to Wishlist"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
