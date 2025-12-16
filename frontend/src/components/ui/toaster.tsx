import * as React from "react"

type ToasterProps = React.HTMLAttributes<HTMLDivElement>

const Toaster = ({ className, ...props }: ToasterProps) => {
  return <div className={className} {...props} />
}

export { Toaster }
