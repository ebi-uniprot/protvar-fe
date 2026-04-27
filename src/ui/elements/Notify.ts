import { toast } from '../toast/toast'

class Notify {
  static info(msg: string)  { toast.info(msg) }
  static warn(msg: string)  { toast.warning(msg) }
  static err(msg: string)   { toast.error(msg) }
  static sucs(msg: string)  { toast.success(msg) }
}

export default Notify
