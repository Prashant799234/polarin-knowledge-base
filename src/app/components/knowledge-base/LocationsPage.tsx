import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Search, ChevronLeft, ChevronRight, ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { DCTableSkeleton } from "./Skeleton";
import { prefersReducedMotion } from "./animations/motionConfig";

const FONT = "'Lato', -apple-system, BlinkMacSystemFont, sans-serif";

// ── Data ─────────────────────────────────────────────────────────────────────

interface DC {
  id: number;
  org: string;
  color: string;
  name: string;
  city: string;
  country: string;
  address: string;
}

const DATA: DC[] = [
  // INDIA – Mumbai / Navi Mumbai
  { id: 1,  org: "GPX",          color: "#6366f1", name: "GPX1",                          city: "Mumbai",         country: "India",       address: "Bandra Kurla Complex, Mumbai, Maharashtra 400051" },
  { id: 2,  org: "GPX",          color: "#6366f1", name: "GPX2",                          city: "Mumbai",         country: "India",       address: "Bandra Kurla Complex, Mumbai, Maharashtra 400051" },
  { id: 3,  org: "IBM",          color: "#006699", name: "IBM",                           city: "Mumbai",         country: "India",       address: "Hiranandani Business Park, Powai, Mumbai, Maharashtra 400076" },
  { id: 4,  org: "Netmagic",     color: "#c41230", name: "Netmagic DC 4 (Vikhroli)",      city: "Mumbai",         country: "India",       address: "L.B.S. Marg, Vikhroli West, Mumbai, Maharashtra 400083" },
  { id: 5,  org: "Netmagic",     color: "#c41230", name: "Netmagic DC 5 (Chandivali)",    city: "Mumbai",         country: "India",       address: "Plot 21, MIDC Chandivali, Andheri East, Mumbai, Maharashtra 400072" },
  { id: 6,  org: "Netmagic",     color: "#c41230", name: "Netmagic DC 6 (Chandivali)",    city: "Mumbai",         country: "India",       address: "Plot 22, MIDC Chandivali, Andheri East, Mumbai, Maharashtra 400072" },
  { id: 7,  org: "Netmagic",     color: "#c41230", name: "NetMagic DC 7 (Chandivali)",    city: "Mumbai",         country: "India",       address: "Plot 23, MIDC Chandivali, Andheri East, Mumbai, Maharashtra 400072" },
  { id: 8,  org: "Netmagic",     color: "#c41230", name: "NetMagic DC 9 (Chandivali)",    city: "Mumbai",         country: "India",       address: "Plot 25, MIDC Chandivali, Andheri East, Mumbai, Maharashtra 400072" },
  { id: 9,  org: "Nxtra",        color: "#ff6b00", name: "Nxtra Chandivali",              city: "Mumbai",         country: "India",       address: "Chandivali Farm Road, Andheri East, Mumbai, Maharashtra 400072" },
  { id: 10, org: "CTRLS",        color: "#1976d2", name: "CTRLS DC1",                     city: "Navi Mumbai",    country: "India",       address: "M1, MIDC Industrial Area, Mahape, Navi Mumbai, Maharashtra 400710" },
  { id: 11, org: "CTRLS",        color: "#1976d2", name: "CTRLS DC2",                     city: "Navi Mumbai",    country: "India",       address: "M2, MIDC Industrial Area, Mahape, Navi Mumbai, Maharashtra 400710" },
  { id: 12, org: "STT GDC",      color: "#00a1c9", name: "STT DC1 (LVSB)",                city: "Mumbai",         country: "India",       address: "L.B.S. Marg, Vikhroli West, Mumbai, Maharashtra 400083" },
  { id: 13, org: "STT GDC",      color: "#00a1c9", name: "STT DC3 (BKC)",                 city: "Mumbai",         country: "India",       address: "G Block, Bandra Kurla Complex, Mumbai, Maharashtra 400051" },
  { id: 14, org: "Sify",         color: "#6a3091", name: "Sify Rabale (Tower 1)",          city: "Navi Mumbai",    country: "India",       address: "Plot REIA-4, TTC Industrial Area, MIDC Rabale, Navi Mumbai, Maharashtra 400701" },
  { id: 15, org: "Sify",         color: "#6a3091", name: "Sify Rabale (Tower 2)",          city: "Navi Mumbai",    country: "India",       address: "Plot REIA-5, TTC Industrial Area, MIDC Rabale, Navi Mumbai, Maharashtra 400701" },
  { id: 16, org: "WebWerks",     color: "#d97706", name: "WebWerks",                       city: "Navi Mumbai",    country: "India",       address: "Millennium Business Park, Sector 1, Mahape, Navi Mumbai, Maharashtra 400710" },
  { id: 17, org: "Yotta",        color: "#7c2d12", name: "Yotta – Panvel",                 city: "Navi Mumbai",    country: "India",       address: "Yotta Data Services, Khopoli Road, Panvel, Navi Mumbai, Maharashtra 410206" },
  { id: 18, org: "Sify",         color: "#6a3091", name: "Sify Airoli",                    city: "Navi Mumbai",    country: "India",       address: "Airoli Knowledge Park, Airoli, Navi Mumbai, Maharashtra 400708" },
  { id: 19, org: "NTT",          color: "#009ddc", name: "NTT Mahape",                     city: "Navi Mumbai",    country: "India",       address: "Plot No. 12, TTC Industrial Area, Mahape, Navi Mumbai, Maharashtra 400710" },
  { id: 20, org: "L&T",          color: "#1a472a", name: "L&T Panvel",                     city: "Navi Mumbai",    country: "India",       address: "L&T Technology Centre, Panvel, Navi Mumbai, Maharashtra 410218" },
  { id: 21, org: "Equinix",      color: "#e8501f", name: "Equinix MB4",                    city: "Mumbai",         country: "India",       address: "G Block, Bandra Kurla Complex, Mumbai, Maharashtra 400098" },
  { id: 22, org: "Bridge DC",    color: "#374151", name: "Bridge DC",                      city: "Mumbai",         country: "India",       address: "Kurla West, Mumbai, Maharashtra 400070" },
  { id: 23, org: "STT GDC",      color: "#00a1c9", name: "STT DC1 (VSB)",                  city: "Mumbai",         country: "India",       address: "Vikhroli, Mumbai, Maharashtra 400079" },
  { id: 24, org: "STT GDC",      color: "#00a1c9", name: "STT DC2 GK1",                    city: "Mumbai",         country: "India",       address: "MIDC Andheri East, Mumbai, Maharashtra 400093" },
  { id: 25, org: "STT GDC",      color: "#00a1c9", name: "STT DC3 GK1",                    city: "Mumbai",         country: "India",       address: "MIDC Andheri East, Mumbai, Maharashtra 400093" },
  { id: 26, org: "PDG",          color: "#0d9488", name: "PDG",                            city: "Mumbai",         country: "India",       address: "Navi Mumbai, Maharashtra, India" },
  // INDIA – Delhi NCR
  { id: 27, org: "Netmagic",     color: "#c41230", name: "NetmagicDC1 (Sec 63)",            city: "Noida",          country: "India",       address: "A-27, Sector 63, Noida, Uttar Pradesh 201301" },
  { id: 28, org: "Nxtra",        color: "#ff6b00", name: "Nxtra Noida1 (Sec 62)",           city: "Noida",          country: "India",       address: "Sector 62, Noida, Uttar Pradesh 201309" },
  { id: 29, org: "CTRLS",        color: "#1976d2", name: "CTRLS Noida DC",                  city: "Noida",          country: "India",       address: "B-16, Sector 63, Noida, Uttar Pradesh 201301" },
  { id: 30, org: "Sify",         color: "#6a3091", name: "Sify Noida DC",                   city: "Noida",          country: "India",       address: "Sector 63, Noida, Uttar Pradesh 201301" },
  { id: 31, org: "Spectra",      color: "#374151", name: "Spectra, Gurgaon",                city: "Gurgaon",        country: "India",       address: "DLF Cyber City, Phase III, Gurugram, Haryana 122002" },
  { id: 32, org: "Yotta",        color: "#7c2d12", name: "Yotta Noida",                     city: "Noida",          country: "India",       address: "Greater Noida Industrial Area, Uttar Pradesh 201306" },
  { id: 33, org: "STT GDC",      color: "#00a1c9", name: "STT Noida DC1",                   city: "Noida",          country: "India",       address: "A-10, Sector 63, Noida, Uttar Pradesh 201301" },
  { id: 34, org: "NTT",          color: "#009ddc", name: "NTT Greater Noida",               city: "Greater Noida",  country: "India",       address: "STPI Technology Park, Greater Noida, Uttar Pradesh 201306" },
  { id: 35, org: "Sify",         color: "#6a3091", name: "Sify Noida DC2",                  city: "Noida",          country: "India",       address: "Sector 135, Noida Expressway, Uttar Pradesh 201304" },
  // INDIA – Bengaluru
  { id: 36, org: "CTRLS",        color: "#1976d2", name: "CTRLS Electronics City",          city: "Bengaluru",      country: "India",       address: "Electronics City Phase 1, Bengaluru, Karnataka 560100" },
  { id: 37, org: "STT GDC",      color: "#00a1c9", name: "STT Bengaluru DC3",               city: "Bengaluru",      country: "India",       address: "KIADB Industrial Area, Whitefield, Bengaluru, Karnataka 560066" },
  { id: 38, org: "Nxtra",        color: "#ff6b00", name: "Nxtra Bengaluru 1 (Whitefield)",  city: "Bengaluru",      country: "India",       address: "Whitefield Main Road, Bengaluru, Karnataka 560066" },
  { id: 39, org: "Netmagic",     color: "#c41230", name: "Netmagic DC2 (Electronics City)", city: "Bengaluru",      country: "India",       address: "Electronics City Phase 2, Bengaluru, Karnataka 560100" },
  { id: 40, org: "Netmagic",     color: "#c41230", name: "Netmagic DC3 (White Field)",      city: "Bengaluru",      country: "India",       address: "EPIP Zone, Whitefield, Bengaluru, Karnataka 560066" },
  { id: 41, org: "MICRONOVA",    color: "#374151", name: "MICRONOVA Rajaji Nagar",          city: "Bengaluru",      country: "India",       address: "Rajaji Nagar Industrial Area, Bengaluru, Karnataka 560010" },
  { id: 42, org: "Sify",         color: "#6a3091", name: "Sify EC",                         city: "Bengaluru",      country: "India",       address: "Electronics City Phase 1, Bengaluru, Karnataka 560100" },
  { id: 43, org: "STT GDC",      color: "#00a1c9", name: "STT DC2",                         city: "Bengaluru",      country: "India",       address: "Whitefield, Bengaluru, Karnataka 560066" },
  { id: 44, org: "Sify",         color: "#6a3091", name: "Sify Vasanth Nagar",              city: "Bengaluru",      country: "India",       address: "Vasanth Nagar, Bengaluru, Karnataka 560052" },
  { id: 45, org: "RGA",          color: "#374151", name: "RGA Techpark Bangalore",          city: "Bengaluru",      country: "India",       address: "Sarjapur Road, Bengaluru, Karnataka 560035" },
  // INDIA – Chennai
  { id: 46, org: "Netmagic",     color: "#c41230", name: "Netmagic Chennai",                city: "Chennai",        country: "India",       address: "Ambattur Industrial Estate, Chennai, Tamil Nadu 600058" },
  { id: 47, org: "Sify",         color: "#6a3091", name: "Sify Chennai Tidel Park",         city: "Chennai",        country: "India",       address: "4 Canal Bank Road, Taramani, Chennai, Tamil Nadu 600113" },
  { id: 48, org: "STT GDC",      color: "#00a1c9", name: "STT DC1 (Sivananda Salai)",       city: "Chennai",        country: "India",       address: "11 Sivananda Salai, Nungambakkam, Chennai, Tamil Nadu 600034" },
  { id: 49, org: "STT GDC",      color: "#00a1c9", name: "STT DC2 (Ambattur)",              city: "Chennai",        country: "India",       address: "Ambattur Industrial Estate, Chennai, Tamil Nadu 600058" },
  { id: 50, org: "STT GDC",      color: "#00a1c9", name: "STT Ambattur DC3",                city: "Chennai",        country: "India",       address: "Phase II, Ambattur Industrial Estate, Chennai, Tamil Nadu 600058" },
  { id: 51, org: "NTT",          color: "#009ddc", name: "NTT Ambattur",                    city: "Chennai",        country: "India",       address: "Ambattur Industrial Estate, Chennai, Tamil Nadu 600053" },
  { id: 52, org: "Nxtra",        color: "#ff6b00", name: "Nxtra Chennai 1 (Siruseri)",      city: "Chennai",        country: "India",       address: "SIPCOT IT Park, Siruseri, Chennai, Tamil Nadu 603103" },
  { id: 53, org: "Nxtra",        color: "#ff6b00", name: "Nxtra Chennai 2 (Siruseri)",      city: "Chennai",        country: "India",       address: "SIPCOT IT Park Phase 2, Siruseri, Chennai, Tamil Nadu 603103" },
  { id: 54, org: "Adani",        color: "#1e40af", name: "Adani Siruseri",                  city: "Chennai",        country: "India",       address: "SIPCOT IT Park, Siruseri, Chennai, Tamil Nadu 603103" },
  { id: 55, org: "Nxtra",        color: "#ff6b00", name: "Nxtra Santhome",                  city: "Chennai",        country: "India",       address: "Santhome High Road, Chennai, Tamil Nadu 600028" },
  { id: 56, org: "Sify",         color: "#6a3091", name: "Sify Siruseri",                   city: "Chennai",        country: "India",       address: "SIPCOT IT Park, Siruseri, Chennai, Tamil Nadu 603103" },
  { id: 57, org: "BAM",          color: "#374151", name: "BAM DLR Ambattur",                city: "Chennai",        country: "India",       address: "Ambattur Industrial Estate, Chennai, Tamil Nadu 600058" },
  // INDIA – Hyderabad
  { id: 58, org: "Sify",         color: "#6a3091", name: "Sify Gachibowli",                 city: "Hyderabad",      country: "India",       address: "Gachibowli, Hyderabad, Telangana 500032" },
  { id: 59, org: "STT GDC",      color: "#00a1c9", name: "STT Hyderabad DC1",               city: "Hyderabad",      country: "India",       address: "Hitech City, Madhapur, Hyderabad, Telangana 500081" },
  { id: 60, org: "CTRLS",        color: "#1976d2", name: "CTRLS DC1 (Madhapur)",            city: "Hyderabad",      country: "India",       address: "Madhapur, Hyderabad, Telangana 500081" },
  { id: 61, org: "CTRLS",        color: "#1976d2", name: "CTRLS DC2 (Financial District)",  city: "Hyderabad",      country: "India",       address: "Financial District, Nanakramguda, Hyderabad, Telangana 500032" },
  { id: 62, org: "ICICI",        color: "#9b2335", name: "ICICI DC, Gachibowli",            city: "Hyderabad",      country: "India",       address: "Gachibowli, Hyderabad, Telangana 500032" },
  { id: 63, org: "Microsoft",    color: "#737373", name: "MS Chandan Valley",               city: "Hyderabad",      country: "India",       address: "Chandan Valley Road, Hyderabad, Telangana 500019" },
  // INDIA – Kolkata
  { id: 64, org: "STT GDC",      color: "#00a1c9", name: "STT Ultadanga",                   city: "Kolkata",        country: "India",       address: "Ultadanga Main Road, Kolkata, West Bengal 700067" },
  { id: 65, org: "Sify",         color: "#6a3091", name: "Sify DC Kolkata",                 city: "Kolkata",        country: "India",       address: "Salt Lake Sector V, Kolkata, West Bengal 700091" },
  // INDIA – Pune
  { id: 66, org: "CTRLS",        color: "#1976d2", name: "CTRLS Silicon Valley",            city: "Pune",           country: "India",       address: "Hinjewadi Phase I, Pune, Maharashtra 411057" },
  { id: 67, org: "STT GDC",      color: "#00a1c9", name: "STT Dighi",                       city: "Pune",           country: "India",       address: "Dighi, Pune, Maharashtra 411015" },
  { id: 68, org: "Nxtra",        color: "#ff6b00", name: "Nextra Hinjewadi",                city: "Pune",           country: "India",       address: "Hinjewadi Phase I, Pune, Maharashtra 411057" },
  { id: 69, org: "WebWerks",     color: "#d97706", name: "Webwerk Hinjewadi",               city: "Pune",           country: "India",       address: "Hinjewadi Phase II, Pune, Maharashtra 411057" },
  { id: 70, org: "Nxtra",        color: "#ff6b00", name: "Nextra Kharadi",                  city: "Pune",           country: "India",       address: "Kharadi, Pune, Maharashtra 411014" },
  // INDIA – Other
  { id: 71, org: "STT GDC",      color: "#00a1c9", name: "Gujarat STT Gift City",           city: "Gandhinagar",    country: "India",       address: "GIFT City, Gandhinagar, Gujarat 382355" },
  { id: 72, org: "Sify",         color: "#6a3091", name: "Sify IT City Lucknow",            city: "Lucknow",        country: "India",       address: "IT City, Lucknow, Uttar Pradesh 226010" },
  { id: 73, org: "CTRLS",        color: "#1976d2", name: "CTRLS Patna",                     city: "Patna",          country: "India",       address: "Bailey Road, Patna, Bihar 800001" },
  // HONG KONG
  { id: 74, org: "PCCW",         color: "#003087", name: "PCCW (MCX10)",                    city: "Hong Kong",      country: "Hong Kong",   address: "39 Ka Yip Street, Chai Wan, Hong Kong" },
  { id: 75, org: "Digital Realty",color:"#004e9f", name: "Digital Realty HKG10",            city: "Hong Kong",      country: "Hong Kong",   address: "33 Chun Choi Street, Tseung Kwan O Industrial Estate, Hong Kong" },
  { id: 76, org: "TGT",          color: "#374151", name: "TGT HKDC2",                       city: "Hong Kong",      country: "Hong Kong",   address: "Tseung Kwan O, New Territories, Hong Kong" },
  { id: 77, org: "OneAsia",      color: "#065f46", name: "OneAsia E-Trade Plaza",           city: "Hong Kong",      country: "Hong Kong",   address: "24 Lee Chung Street, Chai Wan, Hong Kong" },
  { id: 78, org: "China Telecom",color: "#006ab7", name: "China Telecom TKO",               city: "Hong Kong",      country: "Hong Kong",   address: "Tseung Kwan O Industrial Estate, Hong Kong" },
  { id: 79, org: "CITIC Telecom",color: "#c1272d", name: "CITIC Telecom ALC",               city: "Hong Kong",      country: "Hong Kong",   address: "138 Gloucester Road, Wan Chai, Hong Kong" },
  { id: 80, org: "NTT",          color: "#009ddc", name: "NTT – Tai Po",                    city: "Hong Kong",      country: "Hong Kong",   address: "Tai Po Industrial Estate, Tai Po, New Territories, Hong Kong" },
  { id: 81, org: "Equinix",      color: "#e8501f", name: "Equinix HK3",                     city: "Hong Kong",      country: "Hong Kong",   address: "9 Wan Lee Road, Tuen Mun, New Territories, Hong Kong" },
  { id: 82, org: "HKT",          color: "#c00000", name: "HKT SkyExchange – TKO3",         city: "Hong Kong",      country: "Hong Kong",   address: "10 Dai Wang Street, Tseung Kwan O Industrial Estate, Hong Kong" },
  { id: 83, org: "China Unicom", color: "#b91c1c", name: "China Unicom Global Center",      city: "Hong Kong",      country: "Hong Kong",   address: "250 King's Road, North Point, Hong Kong" },
  { id: 84, org: "HKCOLO",       color: "#2e4057", name: "HKCOLO SFC",                      city: "Hong Kong",      country: "Hong Kong",   address: "Edinburgh Place, Central, Hong Kong" },
  { id: 85, org: "Global Switch", color:"#1e3a5f", name: "Global Switch Hong Kong",         city: "Hong Kong",      country: "Hong Kong",   address: "23 Lam Lok Street, Kowloon Bay, Hong Kong" },
  { id: 86, org: "iAdvantage",   color: "#0071ce", name: "iAdvantage JUMBO",                city: "Hong Kong",      country: "Hong Kong",   address: "MEGA Campus, 9 Oi Cheung Road, Kwai Chung, Hong Kong" },
  { id: 87, org: "iAdvantage",   color: "#0071ce", name: "iAdvantage MEGA Plus",            city: "Hong Kong",      country: "Hong Kong",   address: "6 Chun Ying Street, Tseung Kwan O, Hong Kong" },
  { id: 88, org: "iTech",        color: "#374151", name: "iTech Tower 1",                   city: "Hong Kong",      country: "Hong Kong",   address: "120 Wan Chai Road, Wan Chai, Hong Kong" },
  { id: 89, org: "iTech",        color: "#374151", name: "iTech Tower 2",                   city: "Hong Kong",      country: "Hong Kong",   address: "130 Wan Chai Road, Wan Chai, Hong Kong" },
  { id: 90, org: "Telin",        color: "#be185d", name: "Telin – Hong Kong",               city: "Hong Kong",      country: "Hong Kong",   address: "Tuen Mun, New Territories, Hong Kong" },
  { id: 91, org: "PCCW",         color: "#003087", name: "PCCW Solutions MCX10",            city: "Hong Kong",      country: "Hong Kong",   address: "TaiKoo Place, 979 King's Road, Quarry Bay, Hong Kong" },
  { id: 92, org: "PCCW",         color: "#003087", name: "PCCW Global & Keppel ICX (TMH9)", city: "Hong Kong",     country: "Hong Kong",   address: "9 Po Lun Street, Lai Chi Kok, Kowloon, Hong Kong" },
  { id: 93, org: "CITIC Telecom",color: "#c1272d", name: "CITIC Telecom CTT",               city: "Hong Kong",      country: "Hong Kong",   address: "93 Kwai Fuk Road, Kwai Chung, New Territories, Hong Kong" },
  { id: 94, org: "AsiaSat",      color: "#374151", name: "AsiaSat Teleport (GTVN)",         city: "Hong Kong",      country: "Hong Kong",   address: "Tai Po Industrial Estate, Tai Po, New Territories, Hong Kong" },
  { id: 95, org: "OneAsia",      color: "#065f46", name: "OneAsia Legan Center",            city: "Hong Kong",      country: "Hong Kong",   address: "Legan Center, Kwun Tong, Kowloon, Hong Kong" },
  { id: 96, org: "APT",          color: "#374151", name: "APT Datamatrix",                  city: "Hong Kong",      country: "Hong Kong",   address: "Kwai Chung, New Territories, Hong Kong" },
  { id: 97, org: "BDx",          color: "#1a1a1a", name: "BDx HKG2",                        city: "Hong Kong",      country: "Hong Kong",   address: "7 Chun Ying Street, Tseung Kwan O Industrial Estate, Hong Kong" },
  { id: 98, org: "HKCOLO",       color: "#2e4057", name: "HKCOLO CCC",                      city: "Hong Kong",      country: "Hong Kong",   address: "Cheung Sha Wan, Kowloon, Hong Kong" },
  { id: 99, org: "NTT",          color: "#009ddc", name: "NTT FDC1",                        city: "Hong Kong",      country: "Hong Kong",   address: "Tseung Kwan O, New Territories, Hong Kong" },
  { id: 100, org: "iAdvantage",  color: "#0071ce", name: "iAdvantage MEGA-i",               city: "Hong Kong",      country: "Hong Kong",   address: "19 Dai Cheong Street, Tai Po Industrial Estate, Hong Kong" },
  { id: 101, org: "Equinix",     color: "#e8501f", name: "Equinix HK4",                     city: "Hong Kong",      country: "Hong Kong",   address: "10 Shing Yip Street, Kwun Tong, Kowloon, Hong Kong" },
  { id: 102, org: "Telecom House",color:"#374151", name: "Telecom House (TMH2)",            city: "Hong Kong",      country: "Hong Kong",   address: "3 Gloucester Road, Wan Chai, Hong Kong" },
  { id: 103, org: "China Mobile",color: "#1e40af", name: "China Mobile International GNC",  city: "Hong Kong",      country: "Hong Kong",   address: "Room 2601, 26/F, The Center, 99 Queen's Road Central, Hong Kong" },
  { id: 104, org: "Equinix",     color: "#e8501f", name: "Equinix HK1",                     city: "Hong Kong",      country: "Hong Kong",   address: "17/F, 298 King's Road, North Point, Hong Kong" },
  { id: 105, org: "IXTech",      color: "#374151", name: "IXTech IDC",                      city: "Hong Kong",      country: "Hong Kong",   address: "Kwun Tong Industrial Area, Kowloon, Hong Kong" },
  { id: 106, org: "iAdvantage",  color: "#0071ce", name: "iAdvantage ONE",                  city: "Hong Kong",      country: "Hong Kong",   address: "3 Chun Wan Road, Tuen Mun, New Territories, Hong Kong" },
  { id: 107, org: "PCCW",        color: "#003087", name: "PCCW Global MCX10",               city: "Hong Kong",      country: "Hong Kong",   address: "39 Ka Yip Street, Chai Wan, Hong Kong" },
  { id: 108, org: "Telstra",     color: "#4b0082", name: "Telstra HKCS2",                   city: "Hong Kong",      country: "Hong Kong",   address: "Cable TV Tower, 9 Hoi Shing Road, Tsuen Wan, Hong Kong" },
  { id: 109, org: "HKEX",        color: "#374151", name: "HKEX",                            city: "Hong Kong",      country: "Hong Kong",   address: "12/F, One International Finance Centre, Hong Kong" },
  { id: 110, org: "iAdvantage",  color: "#0071ce", name: "iAdvantage MEGA Two",             city: "Hong Kong",      country: "Hong Kong",   address: "Tai Po Industrial Estate, Tai Po, New Territories, Hong Kong" },
  { id: 111, org: "PCCW",        color: "#003087", name: "PCCW Solutions CDX",              city: "Hong Kong",      country: "Hong Kong",   address: "Chai Wan, Hong Kong" },
  { id: 112, org: "PCCW",        color: "#003087", name: "PCCW Global – Hermes House",      city: "Hong Kong",      country: "Hong Kong",   address: "Hermes House, 3 Lambing Road, Kwai Chung, Hong Kong" },
  { id: 113, org: "NTT",         color: "#009ddc", name: "NTT FDC2",                        city: "Hong Kong",      country: "Hong Kong",   address: "Kwai Chung, New Territories, Hong Kong" },
  { id: 114, org: "HKT",         color: "#c00000", name: "HKT SkyExchange – TKO2",         city: "Hong Kong",      country: "Hong Kong",   address: "8 Dai Wang Street, Tseung Kwan O Industrial Estate, Hong Kong" },
  { id: 115, org: "PCCW",        color: "#003087", name: "PCCW Solutions OTC",              city: "Hong Kong",      country: "Hong Kong",   address: "One Telecom Centre, 3 Jaffe Road, Wan Chai, Hong Kong" },
  { id: 116, org: "TGT",         color: "#374151", name: "TGT HKDC1",                       city: "Hong Kong",      country: "Hong Kong",   address: "Tseung Kwan O, New Territories, Hong Kong" },
  { id: 117, org: "Telstra",     color: "#4b0082", name: "Telstra HKCS1",                   city: "Hong Kong",      country: "Hong Kong",   address: "One Kowloon, 1 Wang Yuen Street, Kowloon Bay, Hong Kong" },
  { id: 118, org: "Equinix",     color: "#e8501f", name: "Equinix HK2",                     city: "Hong Kong",      country: "Hong Kong",   address: "9 Wan Lee Road, Tuen Mun, New Territories, Hong Kong" },
  { id: 119, org: "Telekom MY",  color: "#374151", name: "Telekom Malaysia – Hong Kong",    city: "Hong Kong",      country: "Hong Kong",   address: "Kwun Tong, Kowloon, Hong Kong" },
  { id: 120, org: "BDx",         color: "#1a1a1a", name: "BDx HKG1",                        city: "Hong Kong",      country: "Hong Kong",   address: "5 Chun Ying Street, Tseung Kwan O Industrial Estate, Hong Kong" },
  { id: 121, org: "Equinix",     color: "#e8501f", name: "Equinix HK5",                     city: "Hong Kong",      country: "Hong Kong",   address: "3 Wan Lee Road, Tuen Mun, New Territories, Hong Kong" },
  // SINGAPORE
  { id: 122, org: "Equinix",     color: "#e8501f", name: "Equinix SG1",                     city: "Singapore",      country: "Singapore",   address: "26A Ayer Rajah Crescent, Singapore 139963" },
  { id: 123, org: "Equinix",     color: "#e8501f", name: "Equinix SG3",                     city: "Singapore",      country: "Singapore",   address: "11 Changi South Street 3, Singapore 486122" },
  { id: 124, org: "Digital Realty",color:"#004e9f",name: "Digital Realty Digital Loyang 2 (SIN12)", city: "Singapore", country: "Singapore", address: "11 Loyang Close, Singapore 508942" },
  { id: 125, org: "1-Net",       color: "#374151", name: "1-Net East 750D",                 city: "Singapore",      country: "Singapore",   address: "750D Chai Chee Road, Singapore 469004" },
  { id: 126, org: "Digital Realty",color:"#004e9f",name: "Digital Realty Singapore (SIN12)",city: "Singapore",      country: "Singapore",   address: "11 Loyang Close, Singapore 508942" },
  { id: 127, org: "Digital Realty",color:"#004e9f",name: "Digital Realty Digital Loyang 1 (SIN11)", city: "Singapore", country: "Singapore", address: "3 Loyang Way, Singapore 508719" },
  { id: 128, org: "Epsilon",     color: "#0369a1", name: "Epsilon Singapore",               city: "Singapore",      country: "Singapore",   address: "1 Changi Business Park Crescent, Singapore 486025" },
  { id: 129, org: "Iron Mountain",color:"#b0192c", name: "Iron Mountain Singapore",         city: "Singapore",      country: "Singapore",   address: "7 Tampines Grande, Singapore 528736" },
  { id: 130, org: "Equinix",     color: "#e8501f", name: "Equinix IBX SG3",                 city: "Singapore",      country: "Singapore",   address: "11 Changi South Street 3, Singapore 486122" },
  { id: 131, org: "Princeton Digital",color:"#1a56db",name:"Princeton Digital Group SG1",  city: "Singapore",      country: "Singapore",   address: "29 Tampines Industrial Avenue 3, Singapore 528778" },
  { id: 132, org: "M1",          color: "#e20074", name: "M1 MiWorld",                      city: "Singapore",      country: "Singapore",   address: "10 International Business Park, Singapore 609928" },
  { id: 133, org: "Equinix",     color: "#e8501f", name: "Equinix SG2",                     city: "Singapore",      country: "Singapore",   address: "2 Woodlands Loop, Singapore 738100" },
  { id: 134, org: "NTT",         color: "#009ddc", name: "NTT – Serangoon",                 city: "Singapore",      country: "Singapore",   address: "1 Kung Chong Road, Singapore 159147" },
  { id: 135, org: "ST Telemedia",color: "#7e22ce", name: "ST Telemedia Tai Seng 1",         city: "Singapore",      country: "Singapore",   address: "20 Tai Seng Street, Singapore 534054" },
  { id: 136, org: "1-Net",       color: "#374151", name: "1-Net East 750E",                 city: "Singapore",      country: "Singapore",   address: "750E Chai Chee Road, Singapore 469005" },
  { id: 137, org: "Digital Realty",color:"#004e9f",name: "Digital Realty 29A Int'l Business Park (SIN10)", city: "Singapore", country: "Singapore", address: "29A International Business Park, Singapore 609963" },
  { id: 138, org: "Racks Central",color:"#4b5563",name: "Racks Central 1",                  city: "Singapore",      country: "Singapore",   address: "29 Woodlands Industrial Park E1, Singapore 757716" },
  { id: 139, org: "Keppel",      color: "#00613c", name: "Keppel DC Singapore 1",           city: "Singapore",      country: "Singapore",   address: "750 Chai Chee Road, Singapore 469000" },
  // USA
  { id: 140, org: "GTA",         color: "#374151", name: "GTA Piti (from GNC)",             city: "Guam",           country: "USA",         address: "Piti, Guam 96925" },
  { id: 141, org: "GNC",         color: "#374151", name: "GNC (From GTA Piti)",             city: "Guam",           country: "USA",         address: "Guam, 96913" },
  { id: 142, org: "Digital Realty",color:"#004e9f",name: "DR Fortress",                     city: "Honolulu",       country: "USA",         address: "560 N Nimitz Hwy, Honolulu, HI 96817" },
  { id: 143, org: "CoreSite",    color: "#059669", name: "CoreSite LA1",                    city: "Los Angeles",    country: "USA",         address: "900 N Alameda St, Los Angeles, CA 90012" },
  { id: 144, org: "CoreSite",    color: "#059669", name: "CoreSite LA2",                    city: "Los Angeles",    country: "USA",         address: "624 S Grand Ave, Los Angeles, CA 90017" },
  { id: 145, org: "Equinix",     color: "#e8501f", name: "Equinix SV10",                    city: "Sunnyvale",      country: "USA",         address: "355 E Java Dr, Sunnyvale, CA 94089" },
  { id: 146, org: "Equinix",     color: "#e8501f", name: "Equinix SE2",                     city: "Seattle",        country: "USA",         address: "2001 6th Ave, Seattle, WA 98121" },
  { id: 147, org: "Quadranet",   color: "#0f766e", name: "Quadranet IXCA2",                 city: "Los Angeles",    country: "USA",         address: "3640 W Cermak Rd, Chicago, IL 60623" },
  { id: 148, org: "H5",          color: "#16a34a", name: "H5 Data Centers Portland",        city: "Portland",       country: "USA",         address: "3505 NE Columbia Blvd, Portland, OR 97211" },
  { id: 149, org: "Digital Realty",color:"#004e9f",name: "Digital Realty SEA10",            city: "Seattle",        country: "USA",         address: "2001 8th Ave, Seattle, WA 98121" },
  { id: 150, org: "DataBank",    color: "#0ea5e9", name: "DataBank LAS1",                   city: "Las Vegas",      country: "USA",         address: "8520 Patrick Lane, Las Vegas, NV 89123" },
  { id: 151, org: "Equinix",     color: "#e8501f", name: "Equinix LA1",                     city: "Los Angeles",    country: "USA",         address: "1 Wilshire Blvd, Los Angeles, CA 90017" },
  { id: 152, org: "Equinix",     color: "#e8501f", name: "Equinix SV1",                     city: "San Jose",       country: "USA",         address: "11 Great Oaks Blvd, San Jose, CA 95119" },
  { id: 153, org: "Digital Realty",color:"#004e9f",name: "Digital Realty San Francisco 200 Paul Ave", city: "San Francisco", country: "USA", address: "200 Paul Ave, San Francisco, CA 94124" },
  { id: 154, org: "Quadranet",   color: "#0f766e", name: "Quadranet LAX",                   city: "Los Angeles",    country: "USA",         address: "3415 S Sepulveda Blvd, Los Angeles, CA 90034" },
  { id: 155, org: "Equinix",     color: "#e8501f", name: "Equinix SV5",                     city: "Santa Clara",    country: "USA",         address: "3000 Coronado Dr, Santa Clara, CA 95054" },
  { id: 156, org: "Equinix",     color: "#e8501f", name: "Equinix SV3",                     city: "Sunnyvale",      country: "USA",         address: "1350 Borregas Ave, Sunnyvale, CA 94089" },
  { id: 157, org: "INAP",        color: "#7c3aed", name: "INAP Seattle",                    city: "Seattle",        country: "USA",         address: "2001 6th Ave, Seattle, WA 98121" },
  { id: 158, org: "Cogent",      color: "#b45309", name: "Cogent Los Angeles",              city: "Los Angeles",    country: "USA",         address: "1 Wilshire Blvd, Los Angeles, CA 90017" },
  { id: 159, org: "Digital Realty",color:"#004e9f",name: "Digital Realty San Francisco",    city: "San Francisco",  country: "USA",         address: "200 Paul Ave, San Francisco, CA 94124" },
  { id: 160, org: "Scale Matrix",color: "#9333ea", name: "Scale Matrix San Diego",          city: "San Diego",      country: "USA",         address: "9720 Scranton Rd, San Diego, CA 92121" },
  { id: 161, org: "Equinix",     color: "#e8501f", name: "Equinix LA2",                     city: "Los Angeles",    country: "USA",         address: "2020 E Mariposa Ave, El Segundo, CA 90245" },
  { id: 162, org: "DataBank",    color: "#0ea5e9", name: "DataBank SAN1",                   city: "San Diego",      country: "USA",         address: "9725 Scranton Rd, San Diego, CA 92121" },
  { id: 163, org: "Digital Realty",color:"#004e9f",name: "Digital Realty Los Angeles",      city: "Los Angeles",    country: "USA",         address: "700 S Flower St, Los Angeles, CA 90017" },
  { id: 164, org: "Telehouse",   color: "#b91c1c", name: "Telehouse Los Angeles",           city: "Los Angeles",    country: "USA",         address: "5250 W Century Blvd, Los Angeles, CA 90045" },
  { id: 165, org: "Equinix",     color: "#e8501f", name: "Equinix SE3",                     city: "Seattle",        country: "USA",         address: "3355 S 120th Pl, Seattle, WA 98168" },
  { id: 166, org: "Ntirety",     color: "#c2410c", name: "Ntirety San Francisco",           city: "San Francisco",  country: "USA",         address: "365 Main St, San Francisco, CA 94105" },
  { id: 167, org: "Lanset",      color: "#1e3a8a", name: "Lanset America Sacramento",       city: "Sacramento",     country: "USA",         address: "1 Capital Mall, Sacramento, CA 95814" },
  { id: 168, org: "DataBank",    color: "#0ea5e9", name: "DataBank NV2",                    city: "Las Vegas",      country: "USA",         address: "4345 Simmons St, North Las Vegas, NV 89032" },
  // JAPAN
  { id: 169, org: "Equinix",     color: "#e8501f", name: "Equinix TY6",                     city: "Tokyo",          country: "Japan",       address: "1-3-6 Higashi-Shimbashi, Minato-ku, Tokyo 105-0021" },
  { id: 170, org: "Equinix",     color: "#e8501f", name: "Equinix TY7",                     city: "Tokyo",          country: "Japan",       address: "2-1-6 Marunouchi, Chiyoda-ku, Tokyo 100-0005" },
  { id: 171, org: "Equinix",     color: "#e8501f", name: "Equinix TY8",                     city: "Tokyo",          country: "Japan",       address: "3-21-2 Shinonome, Koto-ku, Tokyo 135-0062" },
  { id: 172, org: "Equinix",     color: "#e8501f", name: "Equinix TY1",                     city: "Tokyo",          country: "Japan",       address: "8-17-1 Nishi-Shinjuku, Shinjuku-ku, Tokyo 160-0023" },
  { id: 173, org: "Equinix",     color: "#e8501f", name: "Equinix TY3",                     city: "Tokyo",          country: "Japan",       address: "1-2-38 Shinonome, Koto-ku, Tokyo 135-0062" },
  { id: 174, org: "Equinix",     color: "#e8501f", name: "Equinix TY5",                     city: "Tokyo",          country: "Japan",       address: "8-17-1 Nishi-Shinjuku, Shinjuku-ku, Tokyo 160-0023" },
  { id: 175, org: "Equinix",     color: "#e8501f", name: "Equinix TY9",                     city: "Tokyo",          country: "Japan",       address: "1-4-1 Ariake, Koto-ku, Tokyo 135-0063" },
  { id: 176, org: "Equinix",     color: "#e8501f", name: "Equinix TY10",                    city: "Tokyo",          country: "Japan",       address: "2-4-1 Shinkiba, Koto-ku, Tokyo 136-0082" },
  { id: 177, org: "Equinix",     color: "#e8501f", name: "Equinix TY2",                     city: "Tokyo",          country: "Japan",       address: "3-21-1 Shinonome, Koto-ku, Tokyo 135-0062" },
  { id: 178, org: "AT TOKYO",    color: "#c00000", name: "AT TOKYO CC1",                    city: "Tokyo",          country: "Japan",       address: "3-4-1 Higashi-Shinagawa, Shinagawa-ku, Tokyo 140-0002" },
  { id: 179, org: "AT TOKYO",    color: "#c00000", name: "Tokyo CC2",                       city: "Tokyo",          country: "Japan",       address: "2-3-1 Higashi-Shinagawa, Shinagawa-ku, Tokyo 140-0002" },
  { id: 180, org: "Equinix",     color: "#e8501f", name: "Equinix OS1",                     city: "Osaka",          country: "Japan",       address: "1-3-1 Nanko-Kita, Suminoe-ku, Osaka 559-0034" },
  { id: 181, org: "Equinix",     color: "#e8501f", name: "Equinix TY4",                     city: "Tokyo",          country: "Japan",       address: "1-3-1 Higashi-Shimbashi, Minato-ku, Tokyo 105-0021" },
  { id: 182, org: "ATBeX",       color: "#374151", name: "ATBeXTokyo",                      city: "Tokyo",          country: "Japan",       address: "Otemachi, Chiyoda-ku, Tokyo 100-0004" },
  { id: 183, org: "Shin Otemachi",color:"#374151", name: "Shin Otemachi",                   city: "Tokyo",          country: "Japan",       address: "2-1-3 Otemachi, Chiyoda-ku, Tokyo 100-0004" },
  { id: 184, org: "NTT",         color: "#009ddc", name: "NTT Dojima Osaka",                city: "Osaka",          country: "Japan",       address: "1-6-20 Dojima, Kita-ku, Osaka 530-0003" },
  { id: 185, org: "Arteria Networks",color:"#004f9e",name:"Arteria Networks Toranomon",     city: "Tokyo",          country: "Japan",       address: "1-1-28 Toranomon, Minato-ku, Tokyo 105-0001" },
  // TAIWAN
  { id: 186, org: "New Century", color: "#15803d", name: "New Century InfoComm Tech",       city: "Taipei",         country: "Taiwan",      address: "No. 1, Sec. 2, Zhongshan N Rd, Zhongshan District, Taipei 10452" },
  { id: 187, org: "TWM",         color: "#0369a1", name: "TWM Cloud IDC",                   city: "Taipei",         country: "Taiwan",      address: "No. 12, Sec. 3, Minsheng E Rd, Zhongshan District, Taipei 10462" },
  { id: 188, org: "eASPNet",     color: "#7c3aed", name: "eASPNet Cloud IDC Taipei",        city: "Taipei",         country: "Taiwan",      address: "No. 150, Sec. 6, Minquan E Rd, Neihu District, Taipei 11494" },
  { id: 189, org: "Chief Telecom",color:"#374151", name: "Chief Telecom Taipei",            city: "Taipei",         country: "Taiwan",      address: "No. 2, Zhongshan S Rd, Zhongzheng District, Taipei 10001" },
  // FRANCE
  { id: 190, org: "Interxion",   color: "#dc2626", name: "Interxion MRS1",                  city: "Marseille",      country: "France",      address: "230 Avenue du Prado, 13008 Marseille, France" },
  { id: 191, org: "Interxion",   color: "#dc2626", name: "Interxion MRS2",                  city: "Marseille",      country: "France",      address: "232 Avenue du Prado, 13008 Marseille, France" },
  { id: 192, org: "Interxion",   color: "#dc2626", name: "Interxion MRS3",                  city: "Marseille",      country: "France",      address: "234 Avenue du Prado, 13008 Marseille, France" },
  { id: 193, org: "Interxion",   color: "#dc2626", name: "Interxion MRS4",                  city: "Marseille",      country: "France",      address: "236 Avenue du Prado, 13008 Marseille, France" },
  // INDONESIA
  { id: 194, org: "Princeton Digital",color:"#1a56db",name:"PDG JB1",                      city: "Jakarta",        country: "Indonesia",   address: "Jl. Raya Bekasi Km 28, Cilincing, Jakarta Utara 14140" },
  { id: 195, org: "BD DC",       color: "#374151", name: "BD DC JBT 1",                     city: "Jakarta",        country: "Indonesia",   address: "Jl. TB Simatupang No.18, Pasar Rebo, Jakarta Timur 13760" },
  { id: 196, org: "EDGE DC",     color: "#15803d", name: "EDGE DC 1",                       city: "Jakarta",        country: "Indonesia",   address: "Jl. Ciputat Raya No.2, Kebayoran Lama, Jakarta Selatan 12240" },
  { id: 197, org: "NTT",         color: "#009ddc", name: "NTT JKT2",                        city: "Jakarta",        country: "Indonesia",   address: "Jl. Letjen S. Parman Kav. 22-24, Slipi, Jakarta Barat 11480" },
  { id: 198, org: "SDI",         color: "#374151", name: "SDI",                             city: "Jakarta",        country: "Indonesia",   address: "Jl. Jend. Gatot Subroto Kav.1, Tebet, Jakarta Selatan 12870" },
  { id: 199, org: "Cyber 1",     color: "#dc2626", name: "Cyber 1 APJII",                   city: "Jakarta",        country: "Indonesia",   address: "Jl. Pegangsaan Timur No. 1, Cikini, Jakarta Pusat 10320" },
  { id: 200, org: "DC ISAT",     color: "#374151", name: "DC ISAT (KPPTI)",                 city: "Jakarta",        country: "Indonesia",   address: "Jl. Medan Merdeka Barat No. 21, Gambir, Jakarta Pusat 10110" },
  { id: 201, org: "Nusantara",   color: "#1d4ed8", name: "Nusantara DC",                    city: "Jakarta",        country: "Indonesia",   address: "Jl. Jend. Sudirman Kav. 58, Jakarta Selatan 12190" },
  { id: 202, org: "DCI",         color: "#0f172a", name: "DCI JK1",                         city: "Jakarta",        country: "Indonesia",   address: "Jl. Soekarno-Hatta, Bekasi, West Java 17520" },
  { id: 203, org: "DCI",         color: "#0f172a", name: "DCI JK2",                         city: "Jakarta",        country: "Indonesia",   address: "Kawasan Industri MM2100, Cikarang Barat, Bekasi 17520" },
  { id: 204, org: "DCI",         color: "#0f172a", name: "DCI JK3",                         city: "Jakarta",        country: "Indonesia",   address: "Kawasan Industri MM2100, Cikarang Barat, Bekasi 17521" },
  { id: 205, org: "DCI",         color: "#0f172a", name: "DCI JK4",                         city: "Jakarta",        country: "Indonesia",   address: "Kawasan Industri MM2100, Cikarang Barat, Bekasi 17522" },
  { id: 206, org: "DCI",         color: "#0f172a", name: "DCI JK5",                         city: "Jakarta",        country: "Indonesia",   address: "Kawasan Industri MM2100, Cikarang Barat, Bekasi 17523" },
  { id: 207, org: "DCI",         color: "#0f172a", name: "DCI JK6",                         city: "Jakarta",        country: "Indonesia",   address: "Kawasan Industri MM2100, Cikarang Barat, Bekasi 17524" },
  { id: 208, org: "Princeton Digital",color:"#1a56db",name:"PDG JC1",                      city: "Jakarta",        country: "Indonesia",   address: "Jl. MH Thamrin No.1, Kebon Sirih, Jakarta Pusat 10350" },
  { id: 209, org: "NTT",         color: "#009ddc", name: "NTT JKT3",                        city: "Jakarta",        country: "Indonesia",   address: "Jl. Jend. Sudirman, Jakarta Selatan 12190" },
  { id: 210, org: "Keppel",      color: "#00613c", name: "Indo Keppel DC",                  city: "Jakarta",        country: "Indonesia",   address: "Jl. Jend. Sudirman Kav. 52-53, Jakarta Selatan 12190" },
  // AUSTRALIA
  { id: 211, org: "Equinix",     color: "#e8501f", name: "Equinix SY1",                     city: "Sydney",         country: "Australia",   address: "47 Bourke Rd, Alexandria NSW 2015" },
  { id: 212, org: "Equinix",     color: "#e8501f", name: "Equinix SY2",                     city: "Sydney",         country: "Australia",   address: "4 Eden Park Dr, Macquarie Park NSW 2113" },
  { id: 213, org: "Equinix",     color: "#e8501f", name: "Equinix SY3",                     city: "Sydney",         country: "Australia",   address: "11 Talavera Rd, Macquarie Park NSW 2113" },
  { id: 214, org: "Equinix",     color: "#e8501f", name: "Equinix SY4",                     city: "Sydney",         country: "Australia",   address: "55 Clarence St, Sydney NSW 2000" },
  { id: 215, org: "Equinix",     color: "#e8501f", name: "Equinix SY5",                     city: "Sydney",         country: "Australia",   address: "200 Victoria St, Pyrmont NSW 2009" },
  { id: 216, org: "Equinix",     color: "#e8501f", name: "Equinix SY6",                     city: "Sydney",         country: "Australia",   address: "2 Richardson Pl, North Ryde NSW 2113" },
  { id: 217, org: "Global Switch",color:"#1e3a5f", name: "Global Switch Sydney",            city: "Sydney",         country: "Australia",   address: "400 Harris St, Ultimo NSW 2007" },
  { id: 218, org: "NextDC",      color: "#0c2340", name: "NextDC S1 Sydney",                city: "Sydney",         country: "Australia",   address: "75 Capper St, Tullamarine VIC 3043" },
  { id: 219, org: "NextDC",      color: "#0c2340", name: "NextDC B1",                       city: "Brisbane",       country: "Australia",   address: "14 Holt St, Pinkenba QLD 4008" },
  { id: 220, org: "NextDC",      color: "#0c2340", name: "NextDC B2",                       city: "Brisbane",       country: "Australia",   address: "48 Brandl St, Eight Mile Plains QLD 4113" },
  { id: 221, org: "Cyxtera",     color: "#7c3aed", name: "Cyxtera SYD10",                   city: "Sydney",         country: "Australia",   address: "1-23 Thomas Holt Dr, Macquarie Park NSW 2113" },
  { id: 222, org: "Cyxtera",     color: "#7c3aed", name: "Cyxtera SYD11",                   city: "Sydney",         country: "Australia",   address: "5-23 Thomas Holt Dr, Macquarie Park NSW 2113" },
  { id: 223, org: "ActivePort",  color: "#1d4ed8", name: "ActivePort Sydney",               city: "Sydney",         country: "Australia",   address: "Level 10, 201 Sussex St, Sydney NSW 2000" },
  { id: 224, org: "ASX",         color: "#92400e", name: "ASX Sydney",                      city: "Sydney",         country: "Australia",   address: "Exchange Centre, 20 Bridge St, Sydney NSW 2000" },
  // VIETNAM
  { id: 225, org: "FPT Telecom", color: "#b91c1c", name: "FPT Telecom HCM",                 city: "Ho Chi Minh City", country: "Vietnam",   address: "FPT Tower, 10 Pham Van Bach, Ho Chi Minh City" },
  { id: 226, org: "VNPTi",       color: "#1d4ed8", name: "VNPTi Ho Chi Minh City",          city: "Ho Chi Minh City", country: "Vietnam",   address: "57 Huynh Thuc Khang, District 1, Ho Chi Minh City" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function initials(org: string): string {
  const words = org.trim().split(/\s+/);
  if (words.length === 1) return org.slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

// ── Filter Dropdown ───────────────────────────────────────────────────────────

function FilterDropdown({
  options, selected, onToggle, onClear, label,
}: {
  options: string[]; selected: Set<string>;
  onToggle: (v: string) => void; onClear: () => void; label: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));
  const active = selected.size > 0;

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-flex" }}>
      <button
        onClick={() => setOpen(v => !v)}
        title={`Filter by ${label}`}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 20, height: 22, background: "none", border: "none", cursor: "pointer",
          padding: 0, borderRadius: 4, position: "relative",
          opacity: active ? 1 : 0.5,
        }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M0.5 1.5h9M2 5h6M3.5 8.5h3" stroke={active ? "#1c808d" : "#7e93b2"} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        {active && (
          <span style={{
            position: "absolute", top: -3, right: -3, width: 8, height: 8,
            borderRadius: "50%", background: "#1c808d",
          }} />
        )}
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 200,
          background: "#fff", border: "1px solid #e2e8f1", borderRadius: 12,
          boxShadow: "0px 4px 16px rgba(96,97,112,0.16)", width: 220, overflow: "hidden",
        }}>
          <div style={{ padding: "8px 12px", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f8fafc", borderRadius: 8, padding: "6px 10px" }}>
              <Search size={14} color="#90a2b9" />
              <input
                autoFocus
                placeholder={`Search ${label}...`}
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ border: "none", background: "none", outline: "none", fontFamily: FONT, fontSize: 13, color: "#0a3954", width: "100%" }}
              />
            </div>
          </div>
          <div style={{ maxHeight: 200, overflowY: "auto" }}>
            {filtered.map(o => (
              <button
                key={o}
                onClick={() => onToggle(o)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 12px", background: "none", border: "none", cursor: "pointer",
                  fontFamily: FONT, fontSize: 13, color: "#0a3954", textAlign: "left",
                  transition: "background 0.1s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f8fafc")}
                onMouseLeave={e => (e.currentTarget.style.background = "none")}
              >
                <span style={{
                  width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${selected.has(o) ? "#1c808d" : "#e2e8f1"}`,
                  background: selected.has(o) ? "#1c808d" : "white", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {selected.has(o) && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                </span>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o}</span>
              </button>
            ))}
          </div>
          {active && (
            <div style={{ borderTop: "1px solid #f1f5f9", padding: "8px 12px" }}>
              <button
                onClick={() => { onClear(); setOpen(false); }}
                style={{ fontFamily: FONT, fontSize: 12, color: "#e7000b", background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                Clear filter
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

const PAGE_SIZES = [10, 20, 50];

export function LocationsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [orgFilter, setOrgFilter] = useState<Set<string>>(new Set());
  const [countryFilter, setCountryFilter] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [pageSizeOpen, setPageSizeOpen] = useState(false);
  const psRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val !== debouncedSearch) {
      setIsSearching(true);
      debounceRef.current = setTimeout(() => {
        setDebouncedSearch(val);
        setPage(1);
        setIsSearching(false);
      }, 200);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (psRef.current && !psRef.current.contains(e.target as Node)) setPageSizeOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const allOrgs = useMemo(() => [...new Set(DATA.map(d => d.org))].sort(), []);
  const allCountries = useMemo(() => [...new Set(DATA.map(d => d.country))].sort(), []);

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return DATA.filter(d => {
      const matchSearch = !q || [d.name, d.org, d.city, d.country, d.address].some(v => v.toLowerCase().includes(q));
      const matchOrg = orgFilter.size === 0 || orgFilter.has(d.org);
      const matchCountry = countryFilter.size === 0 || countryFilter.has(d.country);
      return matchSearch && matchOrg && matchCountry;
    });
  }, [debouncedSearch, orgFilter, countryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const rows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const resetPage = () => setPage(1);

  const toggleOrg = (v: string) => { setOrgFilter(prev => { const s = new Set(prev); s.has(v) ? s.delete(v) : s.add(v); return s; }); resetPage(); };
  const toggleCountry = (v: string) => { setCountryFilter(prev => { const s = new Set(prev); s.has(v) ? s.delete(v) : s.add(v); return s; }); resetPage(); };

  const activeFilterCount = orgFilter.size + countryFilter.size;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Page header */}
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{ width: 56, height: 56, borderRadius: 12, background: "#effcfd", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1c808d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <h1 style={{ margin: 0, fontFamily: FONT, fontWeight: 900, fontSize: 20, lineHeight: "28px", color: "#0a3954" }}>
            Data Center Locations
          </h1>
          <p style={{ margin: 0, fontFamily: FONT, fontWeight: 400, fontSize: 14, lineHeight: "22px", color: "#7e93b2" }}>
            Comprehensive directory of data center facilities across our partner organizations. Find detailed information about each facility including exact addresses, connectivity options, and more.
          </p>
        </div>
      </div>

      {/* Table container */}
      <div style={{ border: "1px solid #e2e8f1", borderRadius: 16, overflow: "hidden", background: "#fff" }}>

        {/* Search + active filters row */}
        <div style={{ padding: 24, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", borderBottom: filtered.length > 0 ? "none" : "1px solid #e2e8f1" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 280,
            background: "#fff", border: "1px solid #e2e8f1", borderRadius: 12,
            paddingLeft: 16, paddingRight: 8, paddingTop: 8, paddingBottom: 8,
          }}>
            <input
              placeholder="Search by organization, data center name or address..."
              value={search}
              onChange={e => handleSearch(e.target.value)}
              style={{ flex: 1, border: "none", outline: "none", fontFamily: FONT, fontSize: 14, color: "#0a3954", background: "transparent", lineHeight: "24px" }}
            />
            {isSearching ? (
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
                style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid #1c808d", borderTopColor: "transparent", flexShrink: 0, animation: undefined }}
              />
            ) : search ? (
              <button onClick={() => { handleSearch(""); }} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 2 }}>
                <X size={18} color="#90a2b9" />
              </button>
            ) : (
              <Search size={20} color="#90a2b9" style={{ flexShrink: 0 }} />
            )}
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={() => { setOrgFilter(new Set()); setCountryFilter(new Set()); resetPage(); }}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
                background: "#fff0f0", border: "1px solid #fca5a5", borderRadius: 8,
                fontFamily: FONT, fontSize: 13, color: "#e7000b", cursor: "pointer",
              }}
            >
              <X size={14} />
              Clear {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}
            </button>
          )}
        </div>

        {/* Table */}
        <div style={{ width: "100%", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: "22%" }} />
              <col style={{ width: "28%" }} />
              <col style={{ width: "17%" }} />
              <col style={{ width: "33%" }} />
            </colgroup>
            <thead>
              <tr>
                {/* Organization */}
                <th style={{ background: "#f8fafc", padding: "14px 8px 14px 24px", textAlign: "left", fontFamily: FONT, fontWeight: 600, fontSize: 14, color: "#7e93b2", borderBottom: "1px solid #e2e8f1", whiteSpace: "nowrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    Organization
                    <FilterDropdown options={allOrgs} selected={orgFilter} onToggle={toggleOrg} onClear={() => { setOrgFilter(new Set()); resetPage(); }} label="Organization" />
                  </div>
                </th>
                {/* DC Name */}
                <th style={{ background: "#f8fafc", padding: "14px 8px", textAlign: "left", fontFamily: FONT, fontWeight: 600, fontSize: 14, color: "#7e93b2", borderBottom: "1px solid #e2e8f1" }}>
                  Data Center Name
                </th>
                {/* City, Country */}
                <th style={{ background: "#f8fafc", padding: "14px 8px", textAlign: "left", fontFamily: FONT, fontWeight: 600, fontSize: 14, color: "#7e93b2", borderBottom: "1px solid #e2e8f1", whiteSpace: "nowrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    City, Country
                    <FilterDropdown options={allCountries} selected={countryFilter} onToggle={toggleCountry} onClear={() => { setCountryFilter(new Set()); resetPage(); }} label="Country" />
                  </div>
                </th>
                {/* Address */}
                <th style={{ background: "#f8fafc", padding: "14px 8px 14px 8px", textAlign: "left", fontFamily: FONT, fontWeight: 600, fontSize: 14, color: "#7e93b2", borderBottom: "1px solid #e2e8f1" }}>
                  Address
                </th>
              </tr>
            </thead>
            <tbody>
              {isSearching ? (
                <DCTableSkeleton rows={pageSize > 10 ? 8 : pageSize} />
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: "48px 24px", textAlign: "center", fontFamily: FONT, fontSize: 14, color: "#90a2b9" }}>
                    No data centers match your search.
                  </td>
                </tr>
              ) : rows.map((dc, i) => (
                <motion.tr
                  key={dc.id}
                  initial={prefersReducedMotion ? {} : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.18, delay: prefersReducedMotion ? 0 : i * 0.025 }}
                  style={{ borderBottom: i < rows.length - 1 ? "1px solid #e2e8f1" : "none" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLTableRowElement).style.background = "#fafbfc")}
                  onMouseLeave={e => ((e.currentTarget as HTMLTableRowElement).style.background = "transparent")}
                >
                  {/* Organization cell */}
                  <td style={{ padding: "14px 8px 14px 16px", verticalAlign: "middle" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8, background: dc.color,
                        flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 11, color: "white", letterSpacing: "0.02em" }}>
                          {initials(dc.org)}
                        </span>
                      </div>
                      <span style={{ fontFamily: FONT, fontSize: 14, color: "#324158", lineHeight: "22px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {dc.org}
                      </span>
                    </div>
                  </td>
                  {/* DC Name cell */}
                  <td style={{ padding: "14px 8px", verticalAlign: "middle" }}>
                    <span style={{ fontFamily: FONT, fontSize: 14, color: "#324158", lineHeight: "22px" }}>
                      {dc.name}
                    </span>
                  </td>
                  {/* City, Country */}
                  <td style={{ padding: "14px 8px", verticalAlign: "middle", whiteSpace: "nowrap" }}>
                    <span style={{ fontFamily: FONT, fontSize: 14, color: "#324158", lineHeight: "22px" }}>
                      {dc.city}, {dc.country}
                    </span>
                  </td>
                  {/* Address */}
                  <td style={{ padding: "14px 8px", verticalAlign: "middle" }}>
                    <span style={{ fontFamily: FONT, fontSize: 14, color: "#324158", lineHeight: "22px" }}>
                      {dc.address}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "14px 16px", gap: 16, borderTop: "1px solid #e2e8f1" }}>
          {/* Total */}
          <span style={{ fontFamily: FONT, fontSize: 14, color: "#324158", marginRight: 4, whiteSpace: "nowrap" }}>
            Total {filtered.length.toLocaleString()} items
          </span>

          {/* Prev */}
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={safePage === 1}
            style={{
              width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: 8, border: "1px solid #bdc7d4", background: safePage === 1 ? "#ecf1f8" : "#ecf1f8",
              cursor: safePage === 1 ? "not-allowed" : "pointer", opacity: safePage === 1 ? 0.5 : 1,
            }}
          >
            <ChevronLeft size={16} color="#374151" />
          </button>

          {/* Page numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let p: number;
            if (totalPages <= 5) p = i + 1;
            else if (safePage <= 3) p = i + 1;
            else if (safePage >= totalPages - 2) p = totalPages - 4 + i;
            else p = safePage - 2 + i;
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{
                  width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
                  borderRadius: 8, fontFamily: FONT, fontSize: 14, fontWeight: 500, cursor: "pointer",
                  border: `1px solid ${p === safePage ? "#1c808d" : "#bdc7d4"}`,
                  background: p === safePage ? "white" : "#ecf1f8",
                  color: p === safePage ? "#1c808d" : "#374151",
                }}
              >
                {p}
              </button>
            );
          })}

          {/* Next */}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            style={{
              width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: 8, border: "1px solid #bdc7d4", background: "#ecf1f8",
              cursor: safePage === totalPages ? "not-allowed" : "pointer", opacity: safePage === totalPages ? 0.5 : 1,
            }}
          >
            <ChevronRight size={16} color="#374151" />
          </button>

          {/* Page size */}
          <div ref={psRef} style={{ position: "relative" }}>
            <button
              onClick={() => setPageSizeOpen(v => !v)}
              style={{
                display: "flex", alignItems: "center", gap: 4, padding: "4px 12px",
                border: "1px solid #e2e8f1", borderRadius: 8, background: "white",
                fontFamily: FONT, fontSize: 14, color: "#0a3954", cursor: "pointer",
              }}
            >
              {pageSize} / page
              <ChevronDown size={18} color="#7e93b2" style={{ transform: pageSizeOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
            </button>
            {pageSizeOpen && (
              <div style={{
                position: "absolute", bottom: "calc(100% + 6px)", right: 0,
                background: "white", border: "1px solid #e2e8f1", borderRadius: 10,
                boxShadow: "0px 4px 16px rgba(96,97,112,0.16)", overflow: "hidden", zIndex: 100,
              }}>
                {PAGE_SIZES.map(s => (
                  <button
                    key={s}
                    onClick={() => { setPageSize(s); setPage(1); setPageSizeOpen(false); }}
                    style={{
                      display: "block", width: "100%", padding: "8px 16px", textAlign: "left",
                      fontFamily: FONT, fontSize: 14, color: s === pageSize ? "#1c808d" : "#0a3954",
                      fontWeight: s === pageSize ? 700 : 400, background: s === pageSize ? "#f0fdfa" : "none",
                      border: "none", cursor: "pointer",
                    }}
                    onMouseEnter={e => { if (s !== pageSize) (e.currentTarget as HTMLButtonElement).style.background = "#f8fafc"; }}
                    onMouseLeave={e => { if (s !== pageSize) (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
                  >
                    {s} / page
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
