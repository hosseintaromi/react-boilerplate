import {
  cloneElement,
  createContext,
  Dispatch,
  MouseEvent,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState
} from "react";
import { Nullable } from "@models/common";
import { Popover as MuiPopover, PopoverProps as MuiPopoverProps } from '@mui/material';

type PopoverProps = Exclude<"open" | "onClose" | "anchorEl", MuiPopoverProps>

interface PopoverContextType {
  anchorEl: Nullable<Element>;
  setAnchorEl: Dispatch<SetStateAction<Nullable<Element>>>;
  props: PopoverProps;
}

const PopoverContext = createContext<Nullable<PopoverContextType>>(null);

const Popover = ({children, ...props}: PropsWithChildren<PopoverProps | any>) => {
  const [anchorEl, setAnchorEl] = useState<Element>();
  return (
      <PopoverContext.Provider value={{anchorEl, setAnchorEl, props}}>
        {children}
      </PopoverContext.Provider>
  );
}

const Toggle = ({children}: PropsWithChildren<any>) => {
  const {setAnchorEl} = useContext(PopoverContext)!;
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const clonedChildren = cloneElement(children, {onClick: handleClick});
  return (
      <>{clonedChildren}</>
  )
}

const Content = ({children}: PropsWithChildren<any>) => {
  const {anchorEl, setAnchorEl, props} = useContext(PopoverContext)!;
  const close = () => {
    setAnchorEl(null)
  }

  return (
      <MuiPopover
          open={!!anchorEl}
          anchorEl={anchorEl}
          onClose={close}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          {...props as any}>
        {typeof children === 'function' ? children(close) : children}
      </MuiPopover>
  )
}

Popover.Toggle = Toggle;
Popover.Content = Content;

export { Popover };
