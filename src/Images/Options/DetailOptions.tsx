import { Box } from "../../layout/Box"
import { FlexBox } from "../../layout/FlexBox"
import { Stack } from "../../layout/Stack"
import removeItem from "../../removeItem"
import details from "../details"
import { useShowState } from "../ImagesProvider"

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

  return <FlexBox gap="xl" alignItems="flex-start">
    <Stack gap="md">
      <strong>Image Details</strong>
      <FlexBox gap="md" wrap>
        {(Object.keys(details) as (keyof typeof details)[]).map(key => 
          <Item key={key} type={key} title={details[key].title} />
        )}
      </FlexBox>
    </Stack>
    <Stack gap="sm" justifyContent="flex-end">
      <button>All</button>
      <button>None</button>
    </Stack>
  </FlexBox>
}

export default DetailOptions