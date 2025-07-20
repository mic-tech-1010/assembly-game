import { clsx } from "clsx"

const Language = (props) => {
    const style = {
        backgroundColor: props.bgColor,
        color: props.color
    }
    
    const className = clsx("language", props.isLanguageLost && "lost")

  return (
   <span style={style} className={className}>
    {props.name}</span>
  )
}

export default Language

