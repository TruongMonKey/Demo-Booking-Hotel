import { useRoutes } from "react-router"
import { router } from "../../router"

function AllRouter() {

    const element = useRoutes(router);
    return (
        <>{element}</>
    );
}

export default AllRouter;