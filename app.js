const express = require('express');
const app = express();
require('dotenv').config();
const Categories = require('./models/categories');

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.get('/', function (req, res) {
    res.send('Serviço API Rest iniciada...');
});

// show
app.get('/jogos', async (req,res) => {
    await Categories.findAll({
        attributes: ['id', 'name', 'description'],
        order: [['id', 'ASC']]
    })
    .then ((jogos) => {
        return res.json({
            erro: false,
            jogos
        });
    }).catch((err) => {
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err} jogo não foi encontrado!!!`
        })
    })
})

//list
app.get('/jogos/:id', async (req,res) => {
    const {id} = req.params;
    try {
        // await User.findAll({where: {id:id}}) (Pesquisa com uma condição)

        const jogos = await Categories.findByPk(id);
        if(!jogos){
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Nenhum jogo encontrado!!"
            })
        }res.status(200).json({
                erro:false,
                jogos
            })
    } catch (err) {
        res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err}`
        })
    }
});

// create
app.post("/jogo" , async (req, res) => {
    // const {id, name, description, price} = req.body;

    var dados = req.body
    console.log(dados)

    await Categories.create(dados)
    .then( () => {
        return res.json({
            erro: false,
            mensagem: "Jogo cadastrado com sucesso!!"
        });
    }).catch ((err) => {
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: Jogo não cadastrado... ${err}`
        })
    })
})

//update
app.put("/jogo", async (req, res) => {
    const {id} = req.body;

    await Categories.update(req.body, {where: {id}})
    .then(() => {
        return res.json({
            erro: false,
            mensagem: "Informações alteradas com sucesso!!"
        })
    }).catch ((err) => {
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: Informação não alterada.. ${err}`
        })
    })
})

// delete
app.delete("/jogo/:id", async (req, res) => {
    const { id } = req.params;
    await Categories.destroy({where: {id}})
    .then(() => {
        return res.json({
            erro: false,
            mensagem: "Jogo apagado com sucesso!"
        });
    }).catch ((err) => {
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err} Jogo não apagado...`
        })
    })

})

app.listen(process.env.PORT,() => {
    console.log(`Servico iniciado na porta ${process.env.PORT} http://localhost:${process.env.PORT}`);
});

