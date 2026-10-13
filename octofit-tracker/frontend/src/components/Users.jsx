import CollectionPage from './CollectionPage'

function Users() {
  return (
    <CollectionPage
      description="Browse OctoFit Tracker member profiles."
      endpoint="/api/users/"
      request={fetch}
      title="Users"
    />
  )
}

export default Users
