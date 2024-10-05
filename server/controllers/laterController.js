class LaterController {
  constructor(laterModel) {
    this.laterModel = laterModel;
  }

  addLater = async (req, res) => {
    try {
      const { later } = req.body;
      const userId = req.user._id;
      const newLater = await this.laterModel.addLater(later, userId);
      res.status(201).json(newLater);
    } catch (err) {
      res.status(500).send("나중에벌레 추가 중 서버 오류 발생");
    }
  };

  getLaters = async (req, res) => {
    try {
      const userId = req.user._id;
      const laters = await this.laterModel.getLaters(userId);
      res.json(laters);
    } catch (err) {
      res.status(500).send("나중에벌레 불러오기 중 서버 오류 발생");
    }
  };

  updateLater = async (req, res) => {
    try {
      const { title } = req.body;
      const updatedLater = await this.laterModel.updateLater(
        req.params.id,
        title
      );
      if (updatedLater) {
        res.json(updatedLater);
      } else {
        res.status(404).send("나중에벌레를 찾을 수 없습니다.");
      }
    } catch (err) {
      res.status(500).send("나중에벌레 수정 중 서버 오류 발생");
    }
  };

  deleteLater = async (req, res) => {
    try {
      const deleted = await this.laterModel.deleteLater(req.params.id);
      if (deleted) {
        res.status(200).send("나중에벌레가 성공적으로 삭제되었습니다.");
      } else {
        res.status(404).send("나중에벌레를 찾을 수 없습니다.");
      }
    } catch (err) {
      res.status(500).send("나중에벌레 삭제 중 서버 오류 발생");
    }
  };
}

module.exports = LaterController;
