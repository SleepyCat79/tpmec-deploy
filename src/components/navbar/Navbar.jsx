'use client'
import './navbar.css'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
const checkActive = (check) =>{
    if (check) {
        return 'active'
    } else {
        return ''
    }
}
export default function Navbar() {
    const router = useRouter()
    const pathName=usePathname()
    return(
        <div className='navbar_container'>
            <div className='name_container'>
                <h3>TPM</h3>
            </div>
            <div className='link_container'>
                <Link href="/"><p className="hover-underline-animation" >Home</p></Link>
                <Link href="/about"><p className="hover-underline-animation">About</p></Link>
                <Link href="/contact"><p className="hover-underline-animation">Contact</p></Link>
            
            </div>
            <div className='btn_container'>
                <div>
                <button onClick={()=>router.push('/sign_in')}>
                    Sign In
                </button>
                <button onClick={()=>router.push('/sign_up_1')}>
                    Sign Up
                </button>
                </div>
            </div>

        </div>

    )
}