import FlexBox from '../../layout/FlexBox'
import Stack from '../../layout/Stack'
import removeItem from '../../removeItem'
import details from '../details'
import { useShowState } from '../ImagesProvider'

const DetailOptions = () => {
  const [show, setShow] = useShowState()

  const handleChange = (key: string, checked: boolean) =>
    setShow(
      checked
        ? show.concat([key])
        : removeItem(show, key)
    )

  const Item = ({title, type}: {title: string, type: string}) =>
    <label htmlFor={`${type}Details`}>
      {title}{' '}
      <input
        type="checkbox"
        checked={show.indexOf(type) > -1}
        id={`${type}Details`}
        onChange={e => handleChange(type, e.target.checked)}
      />
    </label>

  const showKeys = (Object.keys(details) as (keyof typeof details)[])

  return <FlexBox gap="xl" alignItems="flex-start">
    <Stack gap="md">
      <FlexBox gap="md" alignItems="center">
        <strong style={{ flexGrow: 12 }}>Image Details</strong>
        <button onClick={() => setShow(showKeys)}>
          All
        </button>
        <button onClick={() => setShow([])}>
          None
        </button>
      </FlexBox>
      <FlexBox gap="md" wrap>
        {showKeys.map(key => 
          <Item key={key} type={key} title={details[key].title} />
        )}
      </FlexBox>
    </Stack>
  </FlexBox>
}

export default DetailOptions