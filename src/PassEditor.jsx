import { useState, useRef } from 'react'

const W = {
  panel:'rgba(15,0,28,0.65)',
  section:'rgba(25,4,45,0.5)',
  sectionHead:'rgba(35,8,60,0.4)',
  input:'rgba(12,0,22,0.7)',
  border:'rgba(88,40,140,0.25)',
  borderLight:'rgba(120,60,180,0.15)',
  text:'#e8dff5',
  textDim:'#a090c0',
  accent:'#9b6dff',
  accentDim:'#7c55d4',
  success:'#6ee7a0',
  error:'#f87171',
  discord:'#5865F2',
  discordCard:'#36393f',
  discordText:'#dcddde',
  discordMuted:'#8e9297',
}

const EMPTY_EMBED = () => ({
  title:'', description:'Skip the long queue! just sit back while we secure your spot. Your exclusive Purveyor Pass Link will be delivered straight to you, giving you fast-track access to purchase before the crowd even gets close. ✨\n\n**DIRECT LINK FEE:**\n```\n(DAY PASS)\n\nOnce payment is settled, you\'ll receive your PURVEYOR PASS role along with access to Direct Links and the extension.\n```\n\n⚠️ Important:\n- PC/Laptop is Required to use the Extension and Direct Link.\n- A valid license must also be used. (Given upon payment)', color:'#270052', url:'https://x.com/purveyor_ph',
  author:{name:'',icon_url:'',url:''},
  thumbnail:{url:''},
  images:[''],
  footer:{text:'PURVEYOR TICKETS - 🔖Ticketing Made Easy!',icon_url:'https://i.imgur.com/xBPYOvX.jpeg'},
  fields:[],
})

function Section({title,children,defaultOpen=true}){
  const [open,setOpen]=useState(defaultOpen)
  return(
    <div style={{marginBottom:10,border:`1px solid ${W.border}`,borderRadius:12,overflow:'hidden',backdropFilter:'blur(6px)'}}>
      <div onClick={()=>setOpen(!open)} style={{padding:'10px 14px',background:W.sectionHead,cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <span style={{fontSize:13,fontWeight:600,color:W.text}}>{title}</span>
        <span style={{color:W.textDim,fontSize:11,transition:'transform .2s',transform:open?'rotate(0)':'rotate(-90deg)'}}>▼</span>
      </div>
      {open&&<div style={{padding:14,background:W.section}}>{children}</div>}
    </div>
  )
}

function Input({label,value,onChange,placeholder,multiline,type='text',rows=4}){
  const s={width:'100%',padding:multiline?'10px 12px':'9px 12px',borderRadius:8,border:`1px solid ${W.border}`,background:W.input,color:W.text,fontSize:13,outline:'none',boxSizing:'border-box',fontFamily:"'Outfit',sans-serif",resize:multiline?'vertical':'none',transition:'border-color .2s'}
  return(
    <div style={{marginBottom:10}}>
      {label&&<label style={{color:W.textDim,fontSize:10,fontWeight:700,marginBottom:4,display:'block',textTransform:'uppercase',letterSpacing:0.8}}>{label}</label>}
      {multiline
        ?<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} style={s} onFocus={e=>{e.target.style.borderColor=W.accent}} onBlur={e=>{e.target.style.borderColor=W.border}}/>
        :<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={s} onFocus={e=>{e.target.style.borderColor=W.accent}} onBlur={e=>{e.target.style.borderColor=W.border}}/>
      }
    </div>
  )
}

function parseMarkdown(text){
  if(!text)return ''
  return text
    .replace(/\*\*\*(.+?)\*\*\*/g,'<b><i>$1</i></b>')
    .replace(/\*\*(.+?)\*\*/g,'<b>$1</b>')
    .replace(/\*(.+?)\*/g,'<i>$1</i>')
    .replace(/__(.+?)__/g,'<u>$1</u>')
    .replace(/~~(.+?)~~/g,'<s>$1</s>')
    .replace(/`(.+?)`/g,'<code style="background:rgba(0,0,0,0.4);padding:1px 5px;border-radius:3px;font-size:12px;color:#e0d0ff">$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g,'<a href="$2" style="color:#5865F2;text-decoration:none">$1</a>')
    .replace(/\n/g,'<br/>')
}

function EmbedPreview({embed}){
  const col=embed.color||'#270052'
  const imgs=(embed.images||[]).filter(Boolean)
  return(
    <div style={{display:'flex',gap:0,marginTop:8}}>
      <div style={{width:4,borderRadius:'4px 0 0 4px',background:col,flexShrink:0}}/>
      <div style={{background:'rgba(47,49,54,0.95)',borderRadius:'0 4px 4px 0',padding:'12px 16px',flex:1,maxWidth:520,position:'relative'}}>
        {embed.thumbnail?.url&&<img src={embed.thumbnail.url} alt="" style={{position:'absolute',right:12,top:12,width:64,height:64,borderRadius:4,objectFit:'cover'}} onError={e=>{e.target.style.display='none'}}/>}
        {embed.author?.name&&(
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
            {embed.author.icon_url&&<img src={embed.author.icon_url} alt="" style={{width:22,height:22,borderRadius:11}} onError={e=>{e.target.style.display='none'}}/>}
            <span style={{fontSize:12,fontWeight:600,color:'#fff'}}>{embed.author.name}</span>
          </div>
        )}
        {embed.title&&<div style={{fontSize:15,fontWeight:700,color:embed.url?'#5865F2':'#fff',marginBottom:4}}>{embed.title}</div>}
        {embed.description&&<div style={{fontSize:13,color:W.discordText,lineHeight:1.5}} dangerouslySetInnerHTML={{__html:parseMarkdown(embed.description)}}/>}
        {embed.fields?.length>0&&(
          <div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:10}}>
            {embed.fields.map((f,i)=>(
              <div key={i} style={{flex:f.inline?'1 1 45%':'1 1 100%',minWidth:f.inline?140:'100%'}}>
                <div style={{fontSize:12,fontWeight:700,color:'#fff',marginBottom:2}}>{f.name}</div>
                <div style={{fontSize:13,color:W.discordText,lineHeight:1.4}} dangerouslySetInnerHTML={{__html:parseMarkdown(f.value)}}/>
              </div>
            ))}
          </div>
        )}
        {imgs.length>0&&(
          <div style={{display:'grid',gridTemplateColumns:imgs.length===1?'1fr':'1fr 1fr',gap:4,marginTop:10}}>
            {imgs.map((url,i)=><img key={i} src={url} alt="" style={{width:'100%',borderRadius:6,objectFit:'cover',maxHeight:imgs.length===1?300:200}} onError={e=>{e.target.style.display='none'}}/>)}
          </div>
        )}
        {embed.footer?.text&&(
          <div style={{display:'flex',alignItems:'center',gap:6,marginTop:10}}>
            {embed.footer.icon_url&&<img src={embed.footer.icon_url} alt="" style={{width:18,height:18,borderRadius:9}} onError={e=>{e.target.style.display='none'}}/>}
            <span style={{fontSize:11,color:W.discordMuted}}>{embed.footer.text}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function PassEditor(){
  const [webhookUrl,setWebhookUrl]=useState('https://discord.com/api/webhooks/1488071395819655288/hf0Pa0aMdbGtZsn-PP7e12VgmvEyPAJHz5XNMKGed9ED5ple6JaThEKQ-5WC6GAknzp2')
  const [username,setUsername]=useState('PURVEYOR PASS INFO')
  const [avatarUrl,setAvatarUrl]=useState('https://i.imgur.com/xBPYOvX.jpeg')
  const [content,setContent]=useState('|| <@&1239917793189695538> <@&1286570810127159307> || Buy your Direct Links here: <#1487395775179784262>')
  const [embeds,setEmbeds]=useState([EMPTY_EMBED()])
  const [sending,setSending]=useState(false)
  const [status,setStatus]=useState(null)
  const [galleryImages,setGalleryImages]=useState([''])
  const [jsonImport,setJsonImport]=useState('')
  const [showImport,setShowImport]=useState(false)
  const fileImportRef=useRef(null)

  const updateEmbed=(idx,key,val)=>{const ne=[...embeds];ne[idx]={...ne[idx],[key]:val};setEmbeds(ne)}
  const updateEmbedNested=(idx,parent,key,val)=>{const ne=[...embeds];ne[idx]={...ne[idx],[parent]:{...ne[idx][parent],[key]:val}};setEmbeds(ne)}
  const addField=(idx)=>{const ne=[...embeds];ne[idx].fields=[...ne[idx].fields,{name:'',value:'',inline:false}];setEmbeds(ne)}
  const updateField=(eIdx,fIdx,key,val)=>{const ne=[...embeds];ne[eIdx].fields=[...ne[eIdx].fields];ne[eIdx].fields[fIdx]={...ne[eIdx].fields[fIdx],[key]:val};setEmbeds(ne)}
  const removeField=(eIdx,fIdx)=>{const ne=[...embeds];ne[eIdx].fields=ne[eIdx].fields.filter((_,i)=>i!==fIdx);setEmbeds(ne)}
  const addEmbed=()=>setEmbeds([...embeds,EMPTY_EMBED()])
  const removeEmbed=(idx)=>setEmbeds(embeds.filter((_,i)=>i!==idx))
  const updateImage=(eIdx,iIdx,val)=>{const ne=[...embeds];ne[eIdx].images=[...ne[eIdx].images];ne[eIdx].images[iIdx]=val;setEmbeds(ne)}
  const addImage=(eIdx)=>{const ne=[...embeds];ne[eIdx].images=[...ne[eIdx].images,''];setEmbeds(ne)}
  const removeImage=(eIdx,iIdx)=>{const ne=[...embeds];ne[eIdx].images=ne[eIdx].images.filter((_,i)=>i!==iIdx);setEmbeds(ne)}

  const buildPayload=()=>{
    const payload={content:content||undefined,username:username||undefined,avatar_url:avatarUrl||undefined}
    const built=embeds.map(e=>{
      const em={}
      if(e.title)em.title=e.title
      if(e.description)em.description=e.description
      if(e.url)em.url=e.url
      if(e.color){const c=e.color.replace('#','');em.color=parseInt(c,16)}
      if(e.author?.name)em.author={name:e.author.name,icon_url:e.author.icon_url||undefined,url:e.author.url||undefined}
      if(e.thumbnail?.url)em.thumbnail={url:e.thumbnail.url}
      const imgs=(e.images||[]).filter(Boolean)
      if(imgs.length>0)em.image={url:imgs[0]}
      if(e.footer?.text)em.footer={text:e.footer.text,icon_url:e.footer.icon_url||undefined}
      if(e.fields?.length>0)em.fields=e.fields.filter(f=>f.name||f.value)
      return Object.keys(em).length>0?em:null
    }).filter(Boolean)
    if(built.length>0)payload.embeds=built
    // Extra images as additional embeds with just image.url + same url for gallery
    embeds.forEach(e=>{
      const imgs=(e.images||[]).filter(Boolean)
      if(imgs.length>1&&e.url){
        for(let i=1;i<imgs.length;i++){
          payload.embeds=payload.embeds||[]
          payload.embeds.push({url:e.url,image:{url:imgs[i]}})
        }
      }
    })
    return payload
  }

  const importJson=()=>{
    try{
      const data=JSON.parse(jsonImport)
      if(data.content)setContent(data.content)
      if(data.username)setUsername(data.username)
      if(data.avatar_url)setAvatarUrl(data.avatar_url)
      if(data.embeds&&Array.isArray(data.embeds)){
        const imported=data.embeds.map(e=>({
          title:e.title||'',
          description:e.description||'',
          color:e.color?'#'+e.color.toString(16).padStart(6,'0'):'#270052',
          url:e.url||'',
          author:{name:e.author?.name||'',icon_url:e.author?.icon_url||'',url:e.author?.url||''},
          thumbnail:{url:e.thumbnail?.url||''},
          images:[e.image?.url||''],
          footer:{text:e.footer?.text||'',icon_url:e.footer?.icon_url||''},
          fields:(e.fields||[]).map(f=>({name:f.name||'',value:f.value||'',inline:!!f.inline})),
        }))
        setEmbeds(imported.length>0?imported:[EMPTY_EMBED()])
      }
      setStatus({ok:true,msg:'JSON imported!'});setShowImport(false);setJsonImport('')
    }catch(e){setStatus({ok:false,msg:'Invalid JSON: '+e.message})}
  }

  const importFile=(e)=>{
    const f=e.target.files?.[0];if(!f)return
    const r=new FileReader()
    r.onload=(ev)=>{setJsonImport(ev.target.result);setShowImport(true)}
    r.readAsText(f)
  }

  const send=async()=>{
    if(!webhookUrl){setStatus({ok:false,msg:'Enter a webhook URL'});return}
    setSending(true);setStatus(null)
    try{
      const res=await fetch(webhookUrl,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(buildPayload())})
      if(res.ok||res.status===204)setStatus({ok:true,msg:'Message sent!'})
      else{const t=await res.text();setStatus({ok:false,msg:`Error ${res.status}: ${t}`})}
    }catch(e){setStatus({ok:false,msg:`Failed: ${e.message}`})}
    setSending(false)
  }

  const copyJson=()=>{navigator.clipboard.writeText(JSON.stringify(buildPayload(),null,2));setStatus({ok:true,msg:'JSON copied!'})}

  const smallBtn={padding:'6px 14px',borderRadius:8,border:`1px solid ${W.border}`,background:'transparent',color:W.accent,fontSize:12,cursor:'pointer',fontFamily:"'Outfit',sans-serif"}

  return(
    <div style={{display:'flex',gap:20,padding:'20px',maxWidth:1600,margin:'0 auto',flexWrap:'wrap',position:'relative',zIndex:2,fontFamily:"'Outfit',sans-serif"}}>

      {/* LEFT — Editor */}
      <div style={{flex:'1 1 500px',minWidth:400}}>
        <div style={{background:W.panel,border:`1px solid ${W.border}`,borderRadius:16,padding:22,backdropFilter:'blur(14px)'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
            <h2 style={{margin:0,fontSize:18,fontWeight:700,color:W.text,display:'flex',alignItems:'center',gap:8}}>
              <span style={{fontSize:22}}>🎫</span> Pass Editor
            </h2>
            <div style={{display:'flex',gap:6}}>
              <button onClick={()=>setShowImport(!showImport)} style={{...smallBtn,fontSize:11}}>📥 Import JSON</button>
              <input ref={fileImportRef} type="file" accept=".json" onChange={importFile} style={{display:'none'}}/>
              <button onClick={()=>fileImportRef.current?.click()} style={{...smallBtn,fontSize:11}}>📂 Load File</button>
            </div>
          </div>

          {/* JSON Import panel */}
          {showImport&&(
            <div style={{marginBottom:14,padding:14,background:'rgba(0,0,0,0.2)',borderRadius:10,border:`1px solid ${W.border}`}}>
              <textarea value={jsonImport} onChange={e=>setJsonImport(e.target.value)} placeholder='Paste Discord webhook JSON here...' rows={6}
                style={{width:'100%',padding:10,borderRadius:8,border:`1px solid ${W.border}`,background:W.input,color:W.accent,fontSize:12,outline:'none',boxSizing:'border-box',fontFamily:'monospace',resize:'vertical'}}/>
              <div style={{display:'flex',gap:8,marginTop:8}}>
                <button onClick={importJson} style={{padding:'8px 20px',borderRadius:8,border:'none',background:`linear-gradient(135deg,${W.accentDim},${W.accent})`,color:'#fff',fontSize:13,fontWeight:600,cursor:'pointer'}}>Import</button>
                <button onClick={()=>{setShowImport(false);setJsonImport('')}} style={{...smallBtn}}>Cancel</button>
              </div>
            </div>
          )}

          <Input label="Webhook URL" value={webhookUrl} onChange={setWebhookUrl} placeholder="https://discord.com/api/webhooks/..."/>

          <div style={{display:'flex',gap:10,marginBottom:6}}>
            <div style={{flex:1}}><Input label="Bot Username" value={username} onChange={setUsername} placeholder="Captain Hook"/></div>
            <div style={{flex:1}}><Input label="Avatar URL" value={avatarUrl} onChange={setAvatarUrl} placeholder="https://..."/></div>
          </div>

          <Section title="💬 Message Content">
            <Input multiline value={content} onChange={setContent} placeholder="Message text... supports **bold** *italic* [links](url)"/>
            <p style={{color:W.textDim,fontSize:10,margin:'-6px 0 0',opacity:0.7}}>**bold** *italic* __underline__ ~~strike~~ `code` [link](url) ||spoiler||</p>
          </Section>

          {embeds.map((embed,eIdx)=>(
            <Section key={eIdx} title={`📦 Embed ${eIdx+1}${embed.title?' — '+embed.title:''}`}>
              <div style={{display:'flex',gap:10}}>
                <div style={{flex:1}}><Input label="Title" value={embed.title} onChange={v=>updateEmbed(eIdx,'title',v)} placeholder="Embed title"/></div>
                <div style={{width:80}}>
                  <label style={{color:W.textDim,fontSize:10,fontWeight:700,marginBottom:4,display:'block',textTransform:'uppercase'}}>Color</label>
                  <input type="color" value={embed.color} onChange={e=>updateEmbed(eIdx,'color',e.target.value)} style={{width:'100%',height:36,border:`1px solid ${W.border}`,borderRadius:8,background:'transparent',cursor:'pointer'}}/>
                </div>
              </div>
              <Input label="URL (makes title clickable)" value={embed.url} onChange={v=>updateEmbed(eIdx,'url',v)} placeholder="https://..."/>
              <Input label="Description" multiline rows={16} value={embed.description} onChange={v=>updateEmbed(eIdx,'description',v)} placeholder="Embed description..."/>

              <div style={{marginTop:6,padding:'10px 12px',background:'rgba(0,0,0,0.12)',borderRadius:10,border:`1px solid ${W.borderLight}`}}>
                <p style={{color:W.textDim,fontSize:10,fontWeight:700,marginBottom:6,textTransform:'uppercase'}}>👤 Author</p>
                <div style={{display:'flex',gap:8}}>
                  <div style={{flex:2}}><Input value={embed.author.name} onChange={v=>updateEmbedNested(eIdx,'author','name',v)} placeholder="Author name"/></div>
                  <div style={{flex:3}}><Input value={embed.author.icon_url} onChange={v=>updateEmbedNested(eIdx,'author','icon_url',v)} placeholder="Icon URL"/></div>
                </div>
              </div>

              <div style={{marginTop:6,padding:'10px 12px',background:'rgba(0,0,0,0.12)',borderRadius:10,border:`1px solid ${W.borderLight}`}}>
                <p style={{color:W.textDim,fontSize:10,fontWeight:700,marginBottom:6,textTransform:'uppercase'}}>🖼 Thumbnail</p>
                <Input value={embed.thumbnail.url} onChange={v=>updateEmbedNested(eIdx,'thumbnail','url',v)} placeholder="Small image URL (top-right)"/>
              </div>

              <div style={{marginTop:6,padding:'10px 12px',background:'rgba(0,0,0,0.12)',borderRadius:10,border:`1px solid ${W.borderLight}`}}>
                <p style={{color:W.textDim,fontSize:10,fontWeight:700,marginBottom:6,textTransform:'uppercase'}}>🖼 Images ({(embed.images||[]).length}/4)</p>
                {(embed.images||['']).map((url,iIdx)=>(
                  <div key={iIdx} style={{display:'flex',gap:6,marginBottom:6}}>
                    <input value={url} onChange={e=>updateImage(eIdx,iIdx,e.target.value)} placeholder={`Image URL ${iIdx+1}`}
                      style={{flex:1,padding:'9px 12px',borderRadius:8,border:`1px solid ${W.border}`,background:W.input,color:W.text,fontSize:13,outline:'none',boxSizing:'border-box',fontFamily:"'Outfit',sans-serif"}}/>
                    {(embed.images||[]).length>1&&<button onClick={()=>removeImage(eIdx,iIdx)} style={{background:'none',border:'none',color:W.error,cursor:'pointer',fontSize:14}}>✕</button>}
                  </div>
                ))}
                {(embed.images||[]).length<4&&<button onClick={()=>addImage(eIdx)} style={smallBtn}>+ Add Image</button>}
              </div>

              <div style={{marginTop:6}}>
                <p style={{color:W.textDim,fontSize:10,fontWeight:700,marginBottom:6,textTransform:'uppercase'}}>📋 Fields ({embed.fields.length}/25)</p>
                {embed.fields.map((f,fIdx)=>(
                  <div key={fIdx} style={{padding:'8px 10px',background:'rgba(0,0,0,0.12)',borderRadius:10,marginBottom:6,border:`1px solid ${W.borderLight}`}}>
                    <div style={{display:'flex',gap:8,alignItems:'center'}}>
                      <div style={{flex:1}}><Input value={f.name} onChange={v=>updateField(eIdx,fIdx,'name',v)} placeholder="Field name"/></div>
                      <label style={{color:W.textDim,fontSize:10,display:'flex',alignItems:'center',gap:4,whiteSpace:'nowrap'}}>
                        <input type="checkbox" checked={f.inline} onChange={e=>updateField(eIdx,fIdx,'inline',e.target.checked)} style={{accentColor:W.accent}}/> Inline
                      </label>
                      <button onClick={()=>removeField(eIdx,fIdx)} style={{background:'none',border:'none',color:W.error,cursor:'pointer',fontSize:14}}>✕</button>
                    </div>
                    <Input value={f.value} onChange={v=>updateField(eIdx,fIdx,'value',v)} placeholder="Field value" multiline/>
                  </div>
                ))}
                <button onClick={()=>addField(eIdx)} style={smallBtn}>+ Add Field</button>
              </div>

              <div style={{marginTop:6,padding:'10px 12px',background:'rgba(0,0,0,0.12)',borderRadius:10,border:`1px solid ${W.borderLight}`}}>
                <p style={{color:W.textDim,fontSize:10,fontWeight:700,marginBottom:6,textTransform:'uppercase'}}>📝 Footer</p>
                <div style={{display:'flex',gap:8}}>
                  <div style={{flex:2}}><Input value={embed.footer.text} onChange={v=>updateEmbedNested(eIdx,'footer','text',v)} placeholder="Footer text"/></div>
                  <div style={{flex:3}}><Input value={embed.footer.icon_url} onChange={v=>updateEmbedNested(eIdx,'footer','icon_url',v)} placeholder="Footer icon URL"/></div>
                </div>
              </div>

              {embeds.length>1&&<button onClick={()=>removeEmbed(eIdx)} style={{marginTop:10,padding:'6px 14px',borderRadius:8,border:`1px solid ${W.error}`,background:'transparent',color:W.error,fontSize:12,cursor:'pointer'}}>Remove Embed</button>}
            </Section>
          ))}

          <button onClick={addEmbed} style={{...smallBtn,marginBottom:14}}>+ Add Embed</button>

          <div style={{display:'flex',gap:10,marginTop:8}}>
            <button onClick={send} disabled={sending} style={{flex:1,padding:'14px 0',borderRadius:12,border:'none',background:`linear-gradient(135deg,${W.accentDim},${W.accent})`,color:'#fff',fontSize:15,fontWeight:700,cursor:'pointer',opacity:sending?0.6:1,fontFamily:"'Outfit',sans-serif",boxShadow:'0 4px 20px rgba(155,109,255,0.25)'}}>
              {sending?'Sending...':'💬 Send'}
            </button>
            <button onClick={copyJson} style={{padding:'14px 20px',borderRadius:12,border:`1px solid ${W.border}`,background:'rgba(0,0,0,0.15)',color:W.accent,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:"'Outfit',sans-serif",backdropFilter:'blur(4px)'}}>📋 JSON</button>
          </div>

          {status&&<p style={{marginTop:10,fontSize:13,color:status.ok?W.success:W.error,textAlign:'center',fontWeight:600}}>{status.msg}</p>}
        </div>
      </div>

      {/* RIGHT — Live Preview */}
      <div style={{flex:'1 1 450px',minWidth:380}}>
        <div style={{background:W.panel,border:`1px solid ${W.border}`,borderRadius:16,padding:20,backdropFilter:'blur(14px)',position:'sticky',top:20}}>
          <h3 style={{margin:'0 0 14px',fontSize:15,fontWeight:600,color:W.text}}>👁 Live Preview</h3>
          <div style={{background:W.discordCard,borderRadius:12,padding:18,minHeight:200}}>
            <div style={{display:'flex',alignItems:'flex-start',gap:12}}>
              <img src={avatarUrl||'https://cdn.discordapp.com/embed/avatars/0.png'} alt="" style={{width:42,height:42,borderRadius:21,objectFit:'cover',border:'2px solid rgba(255,255,255,0.08)'}} onError={e=>{e.target.src='https://cdn.discordapp.com/embed/avatars/0.png'}}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:5}}>
                  <span style={{fontSize:14,fontWeight:700,color:'#fff'}}>{username||'Captain Hook'}</span>
                  <span style={{fontSize:9,padding:'2px 5px',borderRadius:3,background:W.discord,color:'#fff',fontWeight:700}}>APP</span>
                  <span style={{fontSize:11,color:W.discordMuted}}>Today</span>
                </div>
                {content&&<div style={{fontSize:14,color:W.discordText,lineHeight:1.5,marginBottom:6}} dangerouslySetInnerHTML={{__html:parseMarkdown(content)}}/>}
                {embeds.map((embed,i)=><EmbedPreview key={i} embed={embed}/>)}
                {galleryImages.filter(Boolean).length>0&&(
                  <div style={{display:'flex',gap:4,marginTop:8,flexWrap:'wrap'}}>
                    {galleryImages.filter(Boolean).map((url,i)=><img key={i} src={url} alt="" style={{maxWidth:200,maxHeight:150,borderRadius:6,objectFit:'cover'}} onError={e=>{e.target.style.display='none'}}/>)}
                  </div>
                )}
              </div>
            </div>
          </div>

          <details style={{marginTop:14}}>
            <summary style={{color:W.textDim,fontSize:12,cursor:'pointer',fontWeight:500}}>📄 View JSON Payload</summary>
            <pre style={{background:'rgba(0,0,0,0.25)',padding:14,borderRadius:10,fontSize:11,color:W.accent,overflow:'auto',maxHeight:300,marginTop:8,border:`1px solid ${W.borderLight}`,lineHeight:1.5}}>{JSON.stringify(buildPayload(),null,2)}</pre>
          </details>
        </div>
      </div>
    </div>
  )
}
