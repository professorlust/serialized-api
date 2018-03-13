import * as likeActions from "../database/actions/likes";
import * as like from "../database/actions/serialPart";
export const toggleLike = async (req, res) => {
  try {
    let result;
    if (req.body.entityType == 0){
      result = await likeActions.toggleLikeSerial(req.session.passport.user, req.body.entityId);
    } else if (req.body.entityType == 1){
      result = await likeActions.toggleLikeSerialPart(req.session.passport.user, req.body.entityId);
    }
    res.json(result);
  } catch (e){
    console.log(e);
    throw e;
  }
}

export const getLikes = async (req, res) => {
  try {
    let result;
    if (req.query.entityType == 1){

      result = await likeActions.getSerialPartLikes(req.query.entityId);
      return res.json(result);
    }
    return res.json(result);
  } catch (e){
    throw e;
  }
};