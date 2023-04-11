import notifier from "simple-react-notifications2";
import "simple-react-notifications2/dist/index.css";
import { Config } from "simple-react-notifications2/dist/NotificationContainer/NotificationContainer";

const defaultConfig : Config = {
  //autoClose: 6000,
  width: "400",
  position: "top-right",
  delay: 0,
  closeOnClick: true,
  pauseOnHover: true,
  onlyLast: false,
  rtl: false,
  newestOnTop: true,
  /*animation: {
    in: "fadeIn",
    out: "fadeOut",
    duration: 400
  }*/
};

class Notify {

  static info(informationMessage: string) {
    notifier.configure(defaultConfig);
    notifier.info(informationMessage);
  }

  static warn(warningMessage: string) {
    notifier.configure(defaultConfig);
    notifier.warn(warningMessage);
  }

  static err(errorMessage: string) {
    notifier.configure(defaultConfig);
    notifier.error(errorMessage);
  }

  static sucs(successMessage: string) {
    notifier.configure(defaultConfig);
    notifier.success(successMessage);
  }
}

export default Notify;