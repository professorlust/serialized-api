import * as serialActions from "../database/actions/serial";
import User from "../database/mongo/User";
/**
 * Get a list of serials. If there is a userId query, gets only serials by that user.
 */
export const getSerials = async (req, res) => {
  try {
    let serials;
    if (req.query.userId) {
      serials = await serialActions.getAuthorSerials(req.query.userId);
      if (
        req.session.passport &&
        req.session.passport.user === req.query.userId
      ) {
        serials.clientOwnsSerials = true;
      }
    } else {
      if (!req.session.passport) {
        serials = await serialActions.getSerials(false);
      } else {
        const user = await User.findOne({ _id: req.session.passport.user });
        serials = await serialActions.getSerials(user.viewNSFW);
      }
      serials.clientOwnsSerials = false;
    }
    res.json(serials);
  } catch (error) {
    return res.json({
      status: "400",
      error: {
        name: error.name,
        message: error.message
      }
    });
  }
};

/**
 * Post a new serial
 */
export const postSerial = async (req, res) => {
  try {
    const newSerial = await serialActions.postSerial(
      req.body,
      req.session.passport.user
    );
    res.json(newSerial);
  } catch (error) {
    return res.json({
      status: "400",
      error: {
        name: error.name,
        message: error.message
      }
    });
  }
};

/**
 * Return a list of Serials by author id
 */
export const getSerialsByAuthorId = async (req, res) => {
  try {
    const authorSerials = await serialActions.getAuthorSerials(
      req.query.userId
    );
    res.json(authorSerials);
  } catch (error) {
    return res.json({
      status: "400",
      error: {
        name: error.name,
        message: error.message
      }
    });
  }
};

/**
 *
 */
export const deleteSerial = async (req, res) => {
  try {
    const deletionResult = await serialActions.deleteSerial(
      req.query.serialId,
      req.session.passport.user
    );
    res.json(deletionResult);
  } catch (error) {
    return res.json({
      status: "400",
      error: {
        name: error.name,
        message: error.message
      }
    });
  }
};

export const editSerial = async (req, res) => {
  try {
    const update = await serialActions.editSerial(
      req.body,
      req.query.serialId,
      req.session.passport.user
    );
    res.json(update);
  } catch (error) {
    return res.json({
      status: "400",
      error: {
        name: error.name,
        message: error.message
      }
    });
  }
};

export const toggleSerialSubscription = async (req, res) => {
  try {
    const result = await serialActions.subscribeToSerial(
      req.params.serialId,
      req.session.passport.user
    );
    res.json(result);
  } catch (e) {
    return res.json({
      status: "400",
      error: {
        name: e.name,
        message: e.message
      }
    });
  }
};

export const checkForUserSubscription = async (req, res) => {
  try {
    let response;
    if (req.session.passport) {
      response = await serialActions.checkForUserSubscription(
        req.params.serialId,
        req.session.passport.user
      );
    } else {
      const noUserError = new Error("No user supplied");
      throw noUserError;
    }
    res.json(response);
  } catch (e) {
    console.log(e);
    return res.json({
      status: "400",
      error: {
        name: e.name,
        message: e.message
      }
    });
  }
};

export const getUserSerialSubscriptions = async (req, res) => {
  try {
    let response;
    if (req.session.passport) {
      response = await serialActions.getUserSerialSubscriptions(
        req.session.passport.user
      );
    } else {
      const noUserError = new Error("No user supplied");
      throw noUserError;
    }
    res.json(response);
  } catch (e) {
    console.log(e);
    return res.json({
      status: "400",
      error: {
        name: e.name,
        message: e.message
      }
    });
  }
};
