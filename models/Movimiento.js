import mongoose from "mongoose";


const movimientosSchema = mongoose.Schema( {
    fecha: {
        type: Date,
        required: true,
      },
    negocio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Negocio',
        require: false
    },
    cuenta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cuenta',
        require: false
    },
    subcuenta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcuenta',
        require: false
    },
    concepto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Concepto',
        require: false
    },
    proveedor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proveedor',
        require: false
    },
    tipo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tipo',
        require: false
    },
    chequeFactura: {
        type: String,
        trim: true,
    },
    comentarios: {
        type: String,
        trim: true,
    },
    ingreso: {
        type: Number,
        trim: true,
        dafault: 0
    },
    egreso: {
        type: Number,
        trim: true,
        dafault: 0
    },
    saldo: {
        type: Number,
        default: 0
    },
    balance: {
        type: Number,
        default: 0
    },
    apiSource: {
        type: Boolean,
        default: true,
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
}, {
    timestamps: true
});

/*movimientosSchema.pre('save', async function(next) {
    //Buscar el balance del negocio con el mismo id
    const balanceActual = await Negocio.findOne({_id: this.negocio});
    //console.log(balanceActual);
    if(this.ingreso){
        this.balance = balanceActual.balance + this.ingreso
    }
    if(this.egreso) {
        this.balance = balanceActual.balance - this.egreso
    }

    if(!this.isNew) {
        const ultimoMovimiento = await Movimiento.findOne({ $or: [{ ingreso: { $exists: true } }, { egreso: { $exists: true } }] }).sort({ _id: -1 });
        const montoAnteriorMovimiento = await Movimiento.findOne({ _id: { $lt: ultimoMovimiento._id }, $or: [{ ingreso: { $exists: true } }, { egreso: { $exists: true } }] }).sort({ _id: -1 });
        if(this.ingreso){
            console.log(montoAnteriorMovimiento.balance);
            const balance = montoAnteriorMovimiento.balance + this.ingreso;
            console.log(balance);
            this.balance = balance;
            this.egreso = 0;
        }
        if(this.egreso){
            console.log(montoAnteriorMovimiento.balance);
            const balance = montoAnteriorMovimiento.balance - this.egreso;
            console.log(balance);
            this.balance = balance;
            this.ingreso = 0;
        }
      
    }
    // Actualizar el campo 'balance' en el modelo Negocio
    const actualizar = await Negocio.updateOne({ _id: this.negocio }, { $set: { balance: this.balance } });
    console.log(actualizar);
    next();
});*/

movimientosSchema.pre('save', async function (next) {
    if (!this.isNew) {
      next();
      return;
    }
  
    const lastMovement = await Movimiento.findOne({}, {}, { sort: { 'createdAt': -1 } });
    let lastBalance = 0;
  
    if (lastMovement) {
      lastBalance = lastMovement.saldo;
    }
  
    this.saldo = lastBalance + this.ingreso - this.egreso;
    next();
  });

const Movimiento = mongoose.model('Movimiento', movimientosSchema);

export default Movimiento;