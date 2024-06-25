import Navbar from "./Navbar";
function Header() {
  return (
    <header>
      {/* header top start */}
      <div className="bg-primaryColor dark:bg-lightGrey10-dark hidden lg:block">
        <div className="container 3xl:container-secondary-lg 4xl:container mx-auto text-whiteColor text-size-12 xl:text-sm py-5px xl:py-9px">
          <div className="flex justify-between items-center">
            <div>
              <p>Call Us: +1 800 123 456 789 - Mail Us: Itcroc@mail.com</p>
            </div>
            <div className="flex gap-37px items-center">
              <div>
                <p>
                  <i className="icofont-location-pin text-primaryColor text-size-15 mr-5px" />
                  <span>684 West College St. Sun City, USA</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* header top end */}
      <Navbar />
    </header>
  );
}
export default Header;
