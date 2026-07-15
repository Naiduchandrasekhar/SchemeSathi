import { pool } from '../database/pool.js'; import { recommend } from '../services/recommendationService.js'; import { extractProfile } from '../services/aiService.js'; import seedSchemes from '../seed/government_schemes.json' with { type: 'json' }
const catalogue = async () => process.env.DATABASE_URL ? (await pool.query('SELECT * FROM government_schemes ORDER BY scheme_name')).rows : seedSchemes
export const listSchemes=async(_,res)=>res.json(await catalogue())
export const getScheme=async(req,res)=>{const schemes=await catalogue(); const scheme=schemes.find(s=>String(s.id)===req.params.id)||schemes[Number(req.params.id)-1]; if(!scheme)return res.status(404).json({message:'Scheme not found'});res.json(scheme)}
export const getRecommendations=async(req,res)=>res.json(recommend(await catalogue(),req.body))
export const extract=async(req,res)=>res.json(await extractProfile(req.body.text))
