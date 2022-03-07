import SpinnerCard from './SpinnerCard'
import InvitationLink from './InvitationLink'

export default function InvitationCard({ message, children }) {
  return (
    <SpinnerCard message={children ?? message ?? null}>
      <InvitationLink />
    </SpinnerCard>
  )
}
