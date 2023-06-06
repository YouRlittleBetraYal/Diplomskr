import React, { useState, useEffect, useCallback } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { SpinnerCircular } from "spinners-react";
import SubscribedUser from "../../components/SubscribedUser/SubscribedUser";

import * as VideoActions from "../../Store/actions/Videos";

function Subscriptions() {
  const [error, seterror] = useState();
  const [loading, setloading] = useState(false);
  const dispatch = useDispatch();
  const Subscriptions = useSelector((state) => state.Vidoes.Suscribers);

  const loadSubscriptions = useCallback(async () => {
    seterror(null);
    try {
      await dispatch(VideoActions.loadSubscriptions());
    } catch (error) {
      seterror(error.message);
      console.log(error.message);
    }
  }, [dispatch, seterror]);

  useEffect(() => {
    setloading(true);
    loadSubscriptions().then(() => {
      setloading(false);
    });
  }, [dispatch, loadSubscriptions, setloading]);

  if (!loading && Subscriptions.length === 0) {
    return <div>У вас немає наявних підписок, підпишіться на когось</div>;
  }

  if (loading) {
    return (
      <div>
        <SpinnerCircular color="#00BFFF" size={30} />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        Помилка!
        <button onClick={loadSubscriptions}>Спробуйте знову</button>
      </div>
    );
  }

  return (
    <Container fluid>
      {Subscriptions.map((subscription) => (
        <SubscribedUser
          Usersname={subscription.name}
          UserPfp={subscription.profileImage}
          ownerId={subscription.id}
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,
molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum
numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium
optio, eaque rerum! Provident similique accusantium nemo autem"
        />
      ))}
    </Container>
  );
}

export default Subscriptions;
