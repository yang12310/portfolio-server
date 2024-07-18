import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    //user의 정보를 갖고오기 위해서 사용함.
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    }); //DB에 저장하기 위해서 필요한 부분 

    await newPost.save();

    const post = await Post.find().sort({"createdAt": -1});
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find().sort({"createdAt": -1});
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getPopularPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId }).sort({"createdAt": -1});
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      //id값을 찾아서 { likes: post.likes } 로 바꾼다. 
      id,
      { likes: post.likes },
      { new: true } //변경된 post를 리턴해준다. 이게 없으면 바뀌기 전 값을 리턴해줌.
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// delete 기능
export const deletePost = async (req, res) => {
  try {
    const { postId, userId } = req.params;
    await Post.deleteOne({_id: postId})
    // const post = await Post.find();
    const post = await Post.find({userId}).sort({"createdAt": -1});
    res.status(201).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// delete 기능
export const patchPost = async (req, res) => {
  try {
    const { postId, userId} = req.params;
    await Post.findOneAndUpdate({_id: postId},{description:req.body.description})
    // const post = await Post.find();
    const post = await Post.find({userId}).sort({"createdAt": -1});
    res.status(201).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
