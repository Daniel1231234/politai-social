import { LucideProps } from 'lucide-react'
import {UserPlus} from 'lucide-react'

export const Icons = {
    Hamburger: (props: LucideProps) => (
        <svg {...props} viewBox="0 0 20 20">
            <title>Menu</title>
          <path
            d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" 
          />
        </svg>
      ),
    UserPlus
}


