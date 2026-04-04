import type { Metadata } from 'next'
import BooksClient from './BooksClient'

export const metadata: Metadata = {
  title: 'ಎಲ್ಲಾ ಪುಸ್ತಕಗಳು (All Books) | Srushti Publications',
  description: 'ನಮ್ಮ ಸಮೃದ್ಧ ಕನ್ನಡ ಪುಸ್ತಕಗಳ ಸಂಗ್ರಹವನ್ನು ಅನ್ವೇಷಿಸಿ. Explore our rich collection of Kannada literature, novels, short stories, and translated works.',
}

export default function BooksPage() {
  return <BooksClient />
}
